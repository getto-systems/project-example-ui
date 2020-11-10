import {
    ForegroundMessage,
    BackgroundMessage,
} from "./worker/data"

import {
    PasswordLoginInit,
    PasswordLoginComponent,
    PasswordLoginParam,
    PasswordLoginRequest,
} from "../component/password_login/component"
import {
    PasswordResetSessionInit,
    PasswordResetSessionComponent,
    PasswordResetSessionRequest,
} from "../component/password_reset_session/component"
import {
    PasswordResetInit,
    PasswordResetParam,
    PasswordResetComponent,
    PasswordResetRequest,
} from "../component/password_reset/component"

import { SecureScriptPathAction } from "../../application/action"
import { StoreAction } from "../../credential/action"

import { LoginAction, LoginFieldCollector } from "../../password_login/action"
import {
    StartSessionAction,
    StartSessionFieldCollector,
    PollingStatusAction,
    ResetAction,
    ResetFieldCollector,
} from "../../password_reset/action"

import { AuthCredential, StoreEvent } from "../../credential/data"
import { LoginID } from "../../login_id/data"
import { Password } from "../../password/data"
import { Content } from "../../field/data"

export type WorkerFactory = Readonly<{
    application: {
        secureScriptPath: Factory<SecureScriptPathAction>
    }

    passwordLogin: {
        login: ParameterizedFactory<LoginFieldCollector, LoginAction>
    }
    passwordReset: {
        startSession: ParameterizedFactory<StartSessionFieldCollector, StartSessionAction>
        pollingStatus: Factory<PollingStatusAction>
        reset: ParameterizedFactory<ResetFieldCollector, ResetAction>
    }
}>
type ProxyFactory = Readonly<{
    credential: {
        store: Factory<StoreAction>
    }
}>

export type WorkerInit = Readonly<{
    passwordLogin: PasswordLoginInit
    passwordResetSession: PasswordResetSessionInit
    passwordReset: PasswordResetInit
}>

export function initAuthWorker(factory: WorkerFactory, init: WorkerInit, worker: Worker): void {
    const resolver = initResolverSet()

    const passwordLogin = new PasswordLoginComponentMap(resolver, postBackgroundMessage)
    const passwordResetSession = new PasswordResetSessionComponentMap(resolver, postBackgroundMessage)
    const passwordReset = new PasswordResetComponentMap(resolver, postBackgroundMessage)

    const actionID = new IDGenerator()
    const storeAction = new StoreActionProxy(actionID, resolver.credential.store, postBackgroundMessage)

    const proxy = {
        credential: {
            store: () => storeAction.init(),
        },
    }

    worker.addEventListener("message", (event: MessageEvent<ForegroundMessage>) => {
        try {
            const data = event.data
            switch (data.type) {
                case "passwordLogin":
                    switch (data.message.type) {
                        case "init":
                            passwordLogin.init(
                                factory,
                                proxy,
                                init.passwordLogin,
                                data.componentID,
                                data.message.param
                            )
                            break
                        case "action":
                            passwordLogin.action(data.componentID, data.message.request)
                            break
                        default:
                            assertNever(data.message)
                    }
                    break

                case "passwordResetSession":
                    switch (data.message.type) {
                        case "init":
                            passwordResetSession.init(
                                factory,
                                init.passwordResetSession,
                                data.componentID
                            )
                            break
                        case "action":
                            passwordResetSession.action(data.componentID, data.message.request)
                            break
                        default:
                            assertNever(data.message)
                    }
                    break

                case "passwordReset":
                    switch (data.message.type) {
                        case "init":
                            passwordReset.init(
                                factory,
                                proxy,
                                init.passwordReset,
                                data.componentID,
                                data.message.param
                            )
                            break
                        case "action":
                            passwordReset.action(data.componentID, data.message.request)
                            break
                        default:
                            assertNever(data.message)
                    }
                    break

                case "loginIDField":
                    switch (data.response.type) {
                        case "content":
                            resolver.field.loginID.resolve(data.handlerID, data.response.content)
                            break
                    }
                    break

                case "passwordField":
                    switch (data.response.type) {
                        case "content":
                            resolver.field.password.resolve(data.handlerID, data.response.content)
                            break
                    }
                    break

                case "credential-store":
                    resolver.credential.store.resolve(data.handlerID, data.response)
                    break

                default:
                    assertNever(data)
            }
        } catch (err) {
            postBackgroundMessage({ type: "error", err: `${err}` })
        }
    })

    function postBackgroundMessage(message: BackgroundMessage) {
        worker.postMessage(message)
    }
}

class IDGenerator {
    id = 0

    generate(): number {
        this.id += 1
        return this.id
    }
}

class Resolver<T> {
    handlerID: IDGenerator

    handler: Record<number, Post<T>> = []

    constructor(handlerID: IDGenerator) {
        this.handlerID = handlerID
    }

    register(post: Post<T>): number {
        const id = this.handlerID.generate()
        this.handler[id] = post
        return id
    }
    resolve(id: number, event: T): void {
        if (this.handler[id]) {
            this.handler[id](event)
            delete this.handler[id]
        }
    }
}

type ResolverSet = Readonly<{
    credential: {
        store: Resolver<StoreEvent>
    }
    field: {
        loginID: Resolver<Content<LoginID>>
        password: Resolver<Content<Password>>
    }
}>

function initResolverSet(): ResolverSet {
    const handlerID = new IDGenerator()

    return {
        credential: {
            store: new Resolver(handlerID),
        },
        field: {
            loginID: new Resolver(handlerID),
            password: new Resolver(handlerID),
        },
    }
}

function collectLoginID(
    componentID: number,
    resolver: Resolver<Content<LoginID>>,
    post: Post<BackgroundMessage>
): { (): Promise<Content<LoginID>> } {
    return () =>
        new Promise((resolve) => {
            post({
                type: "loginIDField",
                componentID,
                handlerID: resolver.register(resolve),
                request: { type: "validate" },
            })
        })
}
function collectPassword(
    componentID: number,
    resolver: Resolver<Content<Password>>,
    post: Post<BackgroundMessage>
): { (): Promise<Content<Password>> } {
    return () =>
        new Promise((resolve) => {
            post({
                type: "passwordField",
                componentID,
                handlerID: resolver.register(resolve),
                request: { type: "validate" },
            })
        })
}

class PasswordLoginComponentMap {
    map: Record<number, PasswordLoginComponent> = []

    resolver: ResolverSet
    post: Post<BackgroundMessage>

    constructor(resolver: ResolverSet, post: Post<BackgroundMessage>) {
        this.resolver = resolver
        this.post = post
    }

    init(
        factory: WorkerFactory,
        proxy: ProxyFactory,
        init: PasswordLoginInit,
        componentID: number,
        param: PasswordLoginParam
    ): void {
        const actions = {
            login: factory.passwordLogin.login({
                loginID: collectLoginID(componentID, this.resolver.field.loginID, this.post),
                password: collectPassword(componentID, this.resolver.field.password, this.post),
            }),
            store: proxy.credential.store(),
            secureScriptPath: factory.application.secureScriptPath(),
        }

        const component = init(actions, param)

        component.onStateChange((state) => {
            this.post({ type: "passwordLogin", componentID, response: { type: "post", state } })
        })

        this.map[componentID] = component
    }
    action(componentID: number, request: PasswordLoginRequest): void {
        if (this.map[componentID]) {
            this.map[componentID].action(request)
        } else {
            this.post({ type: "error", err: "component is not initialized" })
        }
    }
}

class PasswordResetSessionComponentMap {
    map: Record<number, PasswordResetSessionComponent> = []

    resolver: ResolverSet
    post: Post<BackgroundMessage>

    constructor(resolver: ResolverSet, post: Post<BackgroundMessage>) {
        this.resolver = resolver
        this.post = post
    }

    init(factory: WorkerFactory, init: PasswordResetSessionInit, componentID: number): void {
        const actions = {
            startSession: factory.passwordReset.startSession({
                loginID: collectLoginID(componentID, this.resolver.field.loginID, this.post),
            }),
            pollingStatus: factory.passwordReset.pollingStatus(),
        }

        const component = init(actions)

        component.onStateChange((state) => {
            this.post({ type: "passwordResetSession", componentID, response: { type: "post", state } })
        })

        this.map[componentID] = component
    }
    action(componentID: number, request: PasswordResetSessionRequest): void {
        if (this.map[componentID]) {
            this.map[componentID].action(request)
        } else {
            this.post({ type: "error", err: "component is not initialized" })
        }
    }
}

class PasswordResetComponentMap {
    map: Record<number, PasswordResetComponent> = []

    resolver: ResolverSet
    post: Post<BackgroundMessage>

    constructor(resolver: ResolverSet, post: Post<BackgroundMessage>) {
        this.resolver = resolver
        this.post = post
    }

    init(
        factory: WorkerFactory,
        proxy: ProxyFactory,
        init: PasswordResetInit,
        componentID: number,
        param: PasswordResetParam
    ): void {
        const actions = {
            reset: factory.passwordReset.reset({
                loginID: collectLoginID(componentID, this.resolver.field.loginID, this.post),
                password: collectPassword(componentID, this.resolver.field.password, this.post),
            }),
            store: proxy.credential.store(),
            secureScriptPath: factory.application.secureScriptPath(),
        }

        const component = init(actions, param)

        component.onStateChange((state) => {
            this.post({ type: "passwordReset", componentID, response: { type: "post", state } })
        })

        this.map[componentID] = component
    }
    action(componentID: number, request: PasswordResetRequest): void {
        if (this.map[componentID]) {
            this.map[componentID].action(request)
        } else {
            this.post({ type: "error", err: "component is not initialized" })
        }
    }
}

class StoreActionProxy {
    actionID: IDGenerator
    resolver: Resolver<StoreEvent>
    post: Post<BackgroundMessage>

    constructor(actionID: IDGenerator, resolver: Resolver<StoreEvent>, post: Post<BackgroundMessage>) {
        this.actionID = actionID
        this.resolver = resolver
        this.post = post
    }

    init(): StoreAction {
        const id = this.actionID.generate()
        this.post({ type: "credential-store-init", actionID: id })

        return (authCredential: AuthCredential, postStoreEvent: Post<StoreEvent>) => {
            this.post({
                type: "credential-store",
                actionID: id,
                handlerID: this.resolver.register(postStoreEvent),
                request: authCredential,
            })
        }
    }
}

interface Post<T> {
    (state: T): void
}
interface Factory<T> {
    (): T
}
interface ParameterizedFactory<P, T> {
    (param: P): T
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
