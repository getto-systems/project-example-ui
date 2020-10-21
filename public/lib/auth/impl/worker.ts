import { AppHrefInit } from "../../href"
import {
    RenewCredentialComponentSet,
    PasswordLoginComponentSet,
    PasswordResetSessionComponentSet,
    PasswordResetComponentSet,
} from "../view"

import { RenewCredentialInit, RenewCredentialComponent, RenewCredentialParam } from "../component/renew_credential/component"
import { PasswordLoginInit, PasswordLoginComponent, PasswordLoginState, PasswordLoginParam, PasswordLoginRequest } from "../component/password_login/component"
import { PasswordResetSessionInit, PasswordResetSessionComponent, PasswordResetSessionState, PasswordResetSessionRequest } from "../component/password_reset_session/component"
import { PasswordResetInit, PasswordResetParam, PasswordResetComponent, PasswordResetState, PasswordResetRequest } from "../component/password_reset/component"

import { LoginIDFieldInit, LoginIDFieldComponent } from "../component/field/login_id/component"
import { PasswordFieldInit, PasswordFieldComponent } from "../component/field/password/component"

import { SecureScriptPathAction } from "../../application/action"
import { RenewAction, SetContinuousRenewAction, StoreAction } from "../../credential/action"

import { LoginAction, LoginFieldCollector } from "../../password_login/action"
import {
    StartSessionAction, StartSessionFieldCollector,
    PollingStatusAction,
    ResetAction, ResetFieldCollector
} from "../../password_reset/action"

import { LoginIDFieldAction } from "../../login_id/field/action"
import { PasswordFieldAction } from "../../password/field/action"

import { AuthCredential, StoreEvent } from "../../credential/data"
import { LoginID } from "../../login_id/data"
import { LoginIDFieldEvent } from "../../login_id/field/data"
import { Password } from "../../password/data"
import { PasswordFieldEvent } from "../../password/field/data"
import { Content } from "../../field/data"

export interface AuthComponentSetInit {
    renewCredential(param: RenewCredentialParam, setup: Setup<RenewCredentialComponent>): RenewCredentialComponentSet

    passwordLogin(param: PasswordLoginParam): PasswordLoginComponentSet
    passwordResetSession(): PasswordResetSessionComponentSet
    passwordReset(param: PasswordResetParam): PasswordResetComponentSet
}

export type AuthResource = Readonly<{
    components: AuthComponentSetInit
    terminate: Terminate
}>

export type FactorySet = Readonly<{
    application: {
        secureScriptPath: Factory<SecureScriptPathAction>
    }
    credential: {
        renew: Factory<RenewAction>
        setContinuousRenew: Factory<SetContinuousRenewAction>
        store: Factory<StoreAction>
    }

    field: {
        loginID: Factory<LoginIDFieldAction>
        password: Factory<PasswordFieldAction>
    }
}>

export type InitSet = Readonly<{
    href: AppHrefInit

    renewCredential: RenewCredentialInit

    field: {
        loginID: LoginIDFieldInit
        password: PasswordFieldInit
    }
}>

type PasswordLoginProxyComponentSet = Readonly<{
    componentID: number
    components: Readonly<{
        passwordLogin: PasswordLoginComponent
        loginIDField: LoginIDFieldComponent
        passwordField: PasswordFieldComponent
    }>
}>
class PasswordLoginProxy {
    componentID: IDGenerator
    handler: HandlerSet
    fields: {
        loginIDField: LoginIDFieldComponentMap
        passwordField: PasswordFieldComponentMap
    }

    constructor(componentID: IDGenerator, handler: HandlerSet, fields: {
        loginIDField: LoginIDFieldComponentMap
        passwordField: PasswordFieldComponentMap
    }) {
        this.componentID = componentID
        this.handler = handler
        this.fields = fields
    }

    init(param: PasswordLoginParam, action: Post<PasswordLoginRequest>): PasswordLoginProxyComponentSet {
        const componentID = this.componentID.generate()

        const loginIDField = this.fields.loginIDField.init(componentID)
        const passwordField = this.fields.passwordField.init(componentID)

        return {
            componentID,
            components: {
                passwordLogin: {
                    action,
                    onStateChange: (post) => {
                        this.handler.passwordLogin.register(componentID, post)
                    },
                },
                loginIDField,
                passwordField,
            },
        }
    }
}

type PasswordResetSessionProxyComponentSet = Readonly<{
    componentID: number
    components: Readonly<{
        passwordResetSession: PasswordResetSessionComponent
        loginIDField: LoginIDFieldComponent
    }>
}>
class PasswordResetSessionProxy {
    componentID: IDGenerator
    handler: HandlerSet
    fields: {
        loginIDField: LoginIDFieldComponentMap
    }

    constructor(componentID: IDGenerator, handler: HandlerSet, fields: {
        loginIDField: LoginIDFieldComponentMap
    }) {
        this.componentID = componentID
        this.handler = handler
        this.fields = fields
    }

    init(action: Post<PasswordResetSessionRequest>): PasswordResetSessionProxyComponentSet {
        const componentID = this.componentID.generate()

        const loginIDField = this.fields.loginIDField.init(componentID)

        return {
            componentID,
            components: {
                passwordResetSession: {
                    action,
                    onStateChange: (post) => {
                        this.handler.passwordResetSession.register(componentID, post)
                    },
                },
                loginIDField,
            },
        }
    }
}

type PasswordResetProxyComponentSet = Readonly<{
    componentID: number
    components: Readonly<{
        passwordReset: PasswordResetComponent
        loginIDField: LoginIDFieldComponent
        passwordField: PasswordFieldComponent
    }>
}>
class PasswordResetProxy {
    componentID: IDGenerator
    handler: HandlerSet
    fields: {
        loginIDField: LoginIDFieldComponentMap
        passwordField: PasswordFieldComponentMap
    }

    constructor(componentID: IDGenerator, handler: HandlerSet, fields: {
        loginIDField: LoginIDFieldComponentMap
        passwordField: PasswordFieldComponentMap
    }) {
        this.componentID = componentID
        this.handler = handler
        this.fields = fields
    }

    init(param: PasswordResetParam, action: Post<PasswordResetRequest>): PasswordResetProxyComponentSet {
        const componentID = this.componentID.generate()

        const loginIDField = this.fields.loginIDField.init(componentID)
        const passwordField = this.fields.passwordField.init(componentID)

        return {
            componentID,
            components: {
                passwordReset: {
                    action,
                    onStateChange: (post) => {
                        this.handler.passwordReset.register(componentID, post)
                    },
                },
                loginIDField,
                passwordField,
            },
        }
    }
}

class LoginIDFieldComponentMap {
    map: Record<number, LoginIDFieldComponent> = []

    factory: Factory<LoginIDFieldComponent>

    constructor(factory: Factory<LoginIDFieldComponent>) {
        this.factory = factory
    }

    init(componentID: number): LoginIDFieldComponent {
        const loginID = this.factory()
        this.map[componentID] = loginID
        return loginID
    }
    validate(componentID: number, post: Post<LoginIDFieldEvent>): void {
        if (this.map[componentID]) {
            this.map[componentID].validate(post)
        }
    }
}
class PasswordFieldComponentMap {
    map: Record<number, PasswordFieldComponent> = []

    factory: Factory<PasswordFieldComponent>

    constructor(factory: Factory<PasswordFieldComponent>) {
        this.factory = factory
    }

    init(componentID: number): PasswordFieldComponent {
        const password = this.factory()
        this.map[componentID] = password
        return password
    }
    validate(componentID: number, post: Post<PasswordFieldEvent>): void {
        if (this.map[componentID]) {
            this.map[componentID].validate(post)
        }
    }
}

class StoreActionMap {
    map: Record<number, StoreAction> = []

    factory: Factory<StoreAction>

    constructor(factory: Factory<StoreAction>) {
        this.factory = factory
    }

    init(actionID: number): StoreAction {
        const action = this.factory()
        this.map[actionID] = action
        return action
    }
    action(actionID: number, authCredential: AuthCredential, post: Post<StoreEvent>): void {
        if (this.map[actionID]) {
            this.map[actionID](authCredential, post)
        }
    }
}

class Handler<T> {
    listener: Record<number, Post<T>[]> = []

    register(componentID: number, handler: Post<T>): void {
        if (!this.listener[componentID]) {
            this.listener[componentID] = []
        }
        this.listener[componentID].push(handler)
    }
    resolve({ componentID, state }: { componentID: number, state: T }): void {
        if (this.listener[componentID]) {
            this.listener[componentID].forEach(post => post(state))
        }
    }
}

type HandlerSet = Readonly<{
    passwordLogin: Handler<PasswordLoginState>
    passwordResetSession: Handler<PasswordResetSessionState>
    passwordReset: Handler<PasswordResetState>
}>

function initHandlerSet(): HandlerSet {
    return {
        passwordLogin: new Handler(),
        passwordResetSession: new Handler(),
        passwordReset: new Handler(),
    }
}

export function initAuthComponentSetInit(initWorker: Factory<Worker>, factory: FactorySet, init: InitSet, error: Post<string>): AuthResource {
    // TODO const worker = new Worker("./auth.worker.js")
    const worker = initWorker()

    const componentID = new IDGenerator()

    const handler = initHandlerSet()

    const loginIDField = new LoginIDFieldComponentMap(() => init.field.loginID({
        loginID: factory.field.loginID(),
    }))
    const passwordField = new PasswordFieldComponentMap(() => init.field.password({
        password: factory.field.password(),
    }))

    const passwordLogin = new PasswordLoginProxy(componentID, handler, {
        loginIDField,
        passwordField,
    })
    const passwordResetSession = new PasswordResetSessionProxy(componentID, handler, {
        loginIDField,
    })
    const passwordReset = new PasswordResetProxy(componentID, handler, {
        loginIDField,
        passwordField,
    })

    const store = new StoreActionMap(() => factory.credential.store())

    worker.addEventListener("message", (event: MessageEvent<WorkerEvent>) => {
        try {
            const data = event.data
            switch (data.type) {
                case "credential-store-init":
                    store.init(data.actionID)
                    break

                case "credential-store-action":
                    store.action(data.actionID, data.authCredential, (event) => {
                        postWorkerRequest({
                            type: "credential-store-post",
                            actionID: data.actionID,
                            handlerID: data.handlerID,
                            event,
                        })
                    })
                    break

                case "passwordLogin-post":
                    handler.passwordLogin.resolve(data)
                    break

                case "passwordResetSession-post":
                    handler.passwordResetSession.resolve(data)
                    break

                case "passwordReset-post":
                    handler.passwordReset.resolve(data)
                    break

                case "loginIDField-validate":
                    loginIDField.validate(data.componentID, (event) => {
                        postWorkerRequest({
                            type: "loginIDField-content",
                            componentID: data.componentID,
                            handlerID: data.handlerID,
                            content: event.content,
                        })
                    })
                    break

                case "passwordField-validate":
                    passwordField.validate(data.componentID, (event) => {
                        postWorkerRequest({
                            type: "passwordField-content",
                            componentID: data.componentID,
                            handlerID: data.handlerID,
                            content: event.content,
                        })
                    })
                    break

                case "error":
                    error(data.err)
                    break

                default:
                    assertNever(data)
                    break
            }
        } catch (err) {
            error(`${err}`)
        }
    })

    const components: AuthComponentSetInit = {
        renewCredential(param, setup) {
            return initRenewCredential(factory, init, param, setup)
        },

        passwordLogin(param) {
            const { componentID, components } = passwordLogin.init(param, (request) => {
                postWorkerRequest({ type: "passwordLogin-action", componentID, request })
            })
            postWorkerRequest({ type: "passwordLogin-init", componentID, param })
            return {
                href: init.href(),
                ...components,
            }
        },
        passwordResetSession: () => {
            const { componentID, components } = passwordResetSession.init((request) => {
                postWorkerRequest({ type: "passwordResetSession-action", componentID, request })
            })
            postWorkerRequest({ type: "passwordResetSession-init", componentID })
            return {
                href: init.href(),
                ...components,
            }
        },
        passwordReset: (param) => {
            const { componentID, components } = passwordReset.init(param, (request) => {
                postWorkerRequest({ type: "passwordReset-action", componentID, request })
            })
            postWorkerRequest({ type: "passwordReset-init", componentID, param })
            return {
                href: init.href(),
                ...components,
            }
        },
    }

    return {
        components,
        terminate: () => worker.terminate(),
    }

    function postWorkerRequest(request: WorkerRequest) {
        worker.postMessage(request)
    }
}

export type WorkerFactory = Readonly<{
    application: {
        secureScriptPath: Factory<SecureScriptPathAction>
    }

    passwordLogin: {
        login: ParameterFactory<LoginFieldCollector, LoginAction>
    }
    passwordReset: {
        startSession: ParameterFactory<StartSessionFieldCollector, StartSessionAction>
        pollingStatus: Factory<PollingStatusAction>
        reset: ParameterFactory<ResetFieldCollector, ResetAction>
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

    const passwordLogin = new PasswordLoginComponentMap(resolver, postWorkerEvent)
    const passwordResetSession = new PasswordResetSessionComponentMap(resolver, postWorkerEvent)
    const passwordReset = new PasswordResetComponentMap(resolver, postWorkerEvent)

    const actionID = new IDGenerator()
    const storeAction = new StoreActionProxy(actionID, resolver, postWorkerEvent)

    const proxy = {
        credential: {
            store: () => storeAction.init(),
        },
    }

    worker.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
        try {
            const data = event.data
            switch (data.type) {
                case "passwordLogin-init":
                    passwordLogin.init(factory, proxy, init.passwordLogin, data.componentID, data.param)
                    break

                case "passwordLogin-action":
                    passwordLogin.action(data.componentID, data.request)
                    break

                case "passwordResetSession-init":
                    passwordResetSession.init(factory, proxy, init.passwordResetSession, data.componentID)
                    break

                case "passwordResetSession-action":
                    passwordResetSession.action(data.componentID, data.request)
                    break

                case "passwordReset-init":
                    passwordReset.init(factory, proxy, init.passwordReset, data.componentID, data.param)
                    break

                case "passwordReset-action":
                    passwordReset.action(data.componentID, data.request)
                    break

                case "loginIDField-content":
                    resolver.field.loginID.resolve(data.handlerID, data.content)
                    break

                case "passwordField-content":
                    resolver.field.password.resolve(data.handlerID, data.content)
                    break

                case "credential-store-post":
                    resolver.credential.store.resolve(data.handlerID, data.event)
                    break

                default:
                    assertNever(data)
                    break
            }
        } catch (err) {
            postWorkerEvent({ type: "error", err: `${err}` })
        }
    })

    function postWorkerEvent(event: WorkerEvent) {
        worker.postMessage(event)
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

function collectLoginID(componentID: number, resolver: Resolver<Content<LoginID>>, post: Post<WorkerEvent>): { (): Promise<Content<LoginID>> } {
    return () => new Promise((resolve) => {
        post({
            type: "loginIDField-validate",
            componentID,
            handlerID: resolver.register(resolve),
        })
    })
}
function collectPassword(componentID: number, resolver: Resolver<Content<Password>>, post: Post<WorkerEvent>): { (): Promise<Content<Password>> } {
    return () => new Promise((resolve) => {
        post({
            type: "passwordField-validate",
            componentID,
            handlerID: resolver.register(resolve),
        })
    })
}

class PasswordLoginComponentMap {
    map: Record<number, PasswordLoginComponent> = []

    resolver: ResolverSet
    post: Post<WorkerEvent>

    constructor(resolver: ResolverSet, post: Post<WorkerEvent>) {
        this.resolver = resolver
        this.post = post
    }

    init(factory: WorkerFactory, proxy: ProxyFactory, init: PasswordLoginInit, componentID: number, param: PasswordLoginParam): void {
        const actions = {
            login: factory.passwordLogin.login({
                loginID: collectLoginID(componentID, this.resolver.field.loginID, this.post),
                password: collectPassword(componentID, this.resolver.field.password, this.post),
            }),
            store: proxy.credential.store(),
            secureScriptPath: factory.application.secureScriptPath(),
        }

        const component = init(actions, param)

        component.onStateChange(state => {
            this.post({ type: "passwordLogin-post", componentID, state })
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
    post: Post<WorkerEvent>

    constructor(resolver: ResolverSet, post: Post<WorkerEvent>) {
        this.resolver = resolver
        this.post = post
    }

    init(factory: WorkerFactory, proxy: ProxyFactory, init: PasswordResetSessionInit, componentID: number): void {
        const actions = {
            startSession: factory.passwordReset.startSession({
                loginID: collectLoginID(componentID, this.resolver.field.loginID, this.post),
            }),
            pollingStatus: factory.passwordReset.pollingStatus(),
        }

        const component = init(actions)

        component.onStateChange(state => {
            this.post({ type: "passwordResetSession-post", componentID, state })
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
    post: Post<WorkerEvent>

    constructor(resolver: ResolverSet, post: Post<WorkerEvent>) {
        this.resolver = resolver
        this.post = post
    }

    init(factory: WorkerFactory, proxy: ProxyFactory, init: PasswordResetInit, componentID: number, param: PasswordResetParam): void {
        const actions = {
            reset: factory.passwordReset.reset({
                loginID: collectLoginID(componentID, this.resolver.field.loginID, this.post),
                password: collectPassword(componentID, this.resolver.field.password, this.post),
            }),
            store: proxy.credential.store(),
            secureScriptPath: factory.application.secureScriptPath(),
        }

        const component = init(actions, param)

        component.onStateChange(state => {
            this.post({ type: "passwordReset-post", componentID, state })
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
    resolver: ResolverSet
    post: Post<WorkerEvent>

    constructor(actionID: IDGenerator, resolver: ResolverSet, post: Post<WorkerEvent>) {
        this.actionID = actionID
        this.resolver = resolver
        this.post = post
    }

    init(): StoreAction {
        const id = this.actionID.generate()
        this.post({ type: "credential-store-init", actionID: id })

        return (authCredential: AuthCredential, postStoreEvent: Post<StoreEvent>) => {
            this.post({
                type: "credential-store-action",
                actionID: id,
                handlerID: this.resolver.credential.store.register(postStoreEvent),
                authCredential,
            })
        }
    }
}

type WorkerRequest =
    Readonly<{ type: "passwordLogin-init", componentID: number, param: PasswordLoginParam }> |
    Readonly<{ type: "passwordLogin-action", componentID: number, request: PasswordLoginRequest }> |
    Readonly<{ type: "passwordResetSession-init", componentID: number }> |
    Readonly<{ type: "passwordResetSession-action", componentID: number, request: PasswordResetSessionRequest }> |
    Readonly<{ type: "passwordReset-init", componentID: number, param: PasswordResetParam }> |
    Readonly<{ type: "passwordReset-action", componentID: number, request: PasswordResetRequest }> |
    Readonly<{ type: "loginIDField-content", componentID: number, handlerID: number, content: Content<LoginID> }> |
    Readonly<{ type: "passwordField-content", componentID: number, handlerID: number, content: Content<Password> }> |
    Readonly<{ type: "credential-store-post", actionID: number, handlerID: number, event: StoreEvent }>

type WorkerEvent =
    Readonly<{ type: "credential-store-init", actionID: number }> |
    Readonly<{ type: "credential-store-action", actionID: number, handlerID: number, authCredential: AuthCredential }> |
    Readonly<{ type: "passwordLogin-post", componentID: number, state: PasswordLoginState }> |
    Readonly<{ type: "passwordResetSession-post", componentID: number, state: PasswordResetSessionState }> |
    Readonly<{ type: "passwordReset-post", componentID: number, state: PasswordResetState }> |
    Readonly<{ type: "loginIDField-validate", componentID: number, handlerID: number }> |
    Readonly<{ type: "passwordField-validate", componentID: number, handlerID: number }> |
    Readonly<{ type: "error", err: string }>

function initRenewCredential(factory: FactorySet, init: InitSet, param: RenewCredentialParam, setup: Setup<RenewCredentialComponent>) {
    const actions = {
        renew: factory.credential.renew(),
        setContinuousRenew: factory.credential.setContinuousRenew(),
        secureScriptPath: factory.application.secureScriptPath(),
    }

    const renewCredential = init.renewCredential(actions, param)
    setup(renewCredential)

    return {
        renewCredential,
    }
}

interface Setup<T> {
    (component: T): void
}
interface Post<T> {
    (state: T): void
}
interface Factory<T> {
    (): T
}
interface ParameterFactory<P, T> {
    (param: P): T
}
interface Terminate {
    (): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
