import {
    ForegroundMessage,
    BackgroundMessage,
    PasswordLoginComponentProxyResponse,
    PasswordResetSessionComponentProxyResponse,
    PasswordResetComponentProxyResponse,
    LoginIDFieldComponentRequest,
    PasswordFieldComponentRequest,
} from "./data"

import {
    PasswordLoginInit,
    PasswordLoginComponent,
    PasswordLoginParam,
    PasswordLoginRequest,
} from "../../component/password_login/component"
import {
    PasswordResetSessionInit,
    PasswordResetSessionComponent,
    PasswordResetSessionRequest,
} from "../../component/password_reset_session/component"
import {
    PasswordResetInit,
    PasswordResetParam,
    PasswordResetComponent,
    PasswordResetRequest,
} from "../../component/password_reset/component"

import { SecureScriptPathAction } from "../../../application/action"
import { StoreAction } from "../../../credential/action"

import { LoginAction, LoginFieldCollector } from "../../../password_login/action"
import {
    StartSessionAction,
    StartSessionFieldCollector,
    PollingStatusAction,
    ResetAction,
    ResetFieldCollector,
} from "../../../password_reset/action"

import { AuthCredential, StoreEvent } from "../../../credential/data"
import { LoginID } from "../../../login_id/data"
import { Password } from "../../../password/data"
import { Content } from "../../../field/data"

class ComponentMap<C, R, M> {
    map: Record<number, C> = {}

    post: ComponentResponsePost<M>
    handler: ComponentRequestHandler<C, R>

    constructor(post: ComponentResponsePost<M>, handler: ComponentRequestHandler<C, R>) {
        this.post = post
        this.handler = handler
    }

    register(componentID: number, component: C, init: ComponentInitializer<C, M>): void {
        init(component, this.post(componentID))
        this.map[componentID] = component
    }
    handleRequest(componentID: number, request: R): void {
        if (this.map[componentID]) {
            this.handler(this.map[componentID], request)
        } else {
            throw new Error("component is not initialized")
        }
    }
}
interface ComponentResponsePost<M> {
    (componentID: number): Post<M>
}
interface ComponentRequestHandler<C, R> {
    (component: C, request: R): void
}
interface ComponentInitializer<C, M> {
    (component: C, post: Post<M>): void
}

class PasswordLoginComponentMap extends ComponentMap<
    PasswordLoginComponent,
    PasswordLoginRequest,
    PasswordLoginComponentProxyResponse
> {
    factory: PasswordLoginComponentFactory

    constructor(
        factory: PasswordLoginComponentFactory,
        post: ComponentResponsePost<PasswordLoginComponentProxyResponse>
    ) {
        super(post, (component, request) => {
            component.action(request)
        })

        this.factory = factory
    }

    init(componentID: number, param: PasswordLoginParam): void {
        this.register(componentID, this.factory(componentID, param), (component, post) => {
            component.onStateChange((state) => {
                post({ type: "post", state })
            })
        })
    }
}
interface PasswordLoginComponentFactory {
    (componentID: number, param: PasswordLoginParam): PasswordLoginComponent
}

class PasswordResetSessionComponentMap extends ComponentMap<
    PasswordResetSessionComponent,
    PasswordResetSessionRequest,
    PasswordResetSessionComponentProxyResponse
> {
    factory: PasswordResetSessionComponentFactory

    constructor(
        factory: PasswordResetSessionComponentFactory,
        post: ComponentResponsePost<PasswordResetSessionComponentProxyResponse>
    ) {
        super(post, (component, request) => {
            component.action(request)
        })

        this.factory = factory
    }

    init(componentID: number): void {
        this.register(componentID, this.factory(componentID), (component, post) => {
            component.onStateChange((state) => {
                post({ type: "post", state })
            })
        })
    }
}
interface PasswordResetSessionComponentFactory {
    (componentID: number): PasswordResetSessionComponent
}

class PasswordResetComponentMap extends ComponentMap<
    PasswordResetComponent,
    PasswordResetRequest,
    PasswordResetComponentProxyResponse
> {
    factory: PasswordResetComponentFactory

    constructor(
        factory: PasswordResetComponentFactory,
        post: ComponentResponsePost<PasswordResetComponentProxyResponse>
    ) {
        super(post, (component, request) => {
            component.action(request)
        })

        this.factory = factory
    }

    init(componentID: number, param: PasswordResetParam): void {
        this.register(componentID, this.factory(componentID, param), (component, post) => {
            component.onStateChange((state) => {
                post({ type: "post", state })
            })
        })
    }
}
interface PasswordResetComponentFactory {
    (componentID: number, param: PasswordResetParam): PasswordResetComponent
}

class CollectorMap<C, R> {
    handler: Record<number, Post<Content<C>>> = {}

    idGenerator: IDGenerator
    post: CollectPost<R>

    constructor(post: CollectPost<R>) {
        this.idGenerator = new IDGenerator()
        this.post = post
    }

    init(componentID: number, handler: CollectHandler<R>): Collector<C> {
        return () =>
            new Promise((resolve) => {
                const handlerID = this.idGenerator.generate()
                this.handler[handlerID] = resolve
                handler(this.post(componentID, handlerID))
            })
    }
    resolve(handlerID: number, content: Content<C>): void {
        if (this.handler[handlerID]) {
            this.handler[handlerID](content)
            delete this.handler[handlerID]
        } else {
            throw new Error("handler not found")
        }
    }
}
interface Collector<C> {
    (): Promise<Content<C>>
}
interface CollectPost<R> {
    (componentID: number, handlerID: number): Post<R>
}
interface CollectHandler<R> {
    (post: Post<R>): void
}

class LoginIDCollectorMap extends CollectorMap<LoginID, LoginIDFieldComponentRequest> {}
class PasswordCollectorMap extends CollectorMap<Password, PasswordFieldComponentRequest> {}

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

export type WorkerInit = Readonly<{
    passwordLogin: PasswordLoginInit
    passwordResetSession: PasswordResetSessionInit
    passwordReset: PasswordResetInit
}>

export function initAuthWorker(factory: WorkerFactory, init: WorkerInit, worker: Worker): void {
    const resolver = initResolverSet()

    const loginID = new LoginIDCollectorMap((componentID, handlerID) => (request) => {
        postBackgroundMessage({
            type: "loginIDField",
            componentID,
            handlerID,
            request,
        })
    })
    const password = new PasswordCollectorMap((componentID, handlerID) => (request) => {
        postBackgroundMessage({
            type: "passwordField",
            componentID,
            handlerID,
            request,
        })
    })

    const passwordLogin = new PasswordLoginComponentMap(
        (componentID, param) => {
            const actions = {
                login: factory.passwordLogin.login({
                    loginID: loginID.init(componentID, (post) => {
                        post({ type: "validate" })
                    }),
                    password: password.init(componentID, (post) => {
                        post({ type: "validate" })
                    }),
                }),
                store: proxy.credential.store(),
                secureScriptPath: factory.application.secureScriptPath(),
            }

            return init.passwordLogin(actions, param)
        },
        (componentID) => (response) => {
            postBackgroundMessage({ type: "passwordLogin", componentID, response })
        }
    )
    const passwordResetSession = new PasswordResetSessionComponentMap(
        (componentID) => {
            const actions = {
                startSession: factory.passwordReset.startSession({
                    loginID: loginID.init(componentID, (post) => {
                        post({ type: "validate" })
                    }),
                }),
                pollingStatus: factory.passwordReset.pollingStatus(),
            }

            return init.passwordResetSession(actions)
        },
        (componentID) => (response) => {
            postBackgroundMessage({ type: "passwordResetSession", componentID, response })
        }
    )
    const passwordReset = new PasswordResetComponentMap(
        (componentID, param) => {
            const actions = {
                reset: factory.passwordReset.reset({
                    loginID: loginID.init(componentID, (post) => {
                        post({ type: "validate" })
                    }),
                    password: password.init(componentID, (post) => {
                        post({ type: "validate" })
                    }),
                }),
                store: proxy.credential.store(),
                secureScriptPath: factory.application.secureScriptPath(),
            }

            return init.passwordReset(actions, param)
        },
        (componentID) => (response) => {
            postBackgroundMessage({ type: "passwordReset", componentID, response })
        }
    )

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
                            passwordLogin.init(data.componentID, data.message.param)
                            break
                        case "action":
                            passwordLogin.handleRequest(data.componentID, data.message.request)
                            break
                        default:
                            assertNever(data.message)
                    }
                    break

                case "passwordResetSession":
                    switch (data.message.type) {
                        case "init":
                            passwordResetSession.init(data.componentID)
                            break
                        case "action":
                            passwordResetSession.handleRequest(data.componentID, data.message.request)
                            break
                        default:
                            assertNever(data.message)
                    }
                    break

                case "passwordReset":
                    switch (data.message.type) {
                        case "init":
                            passwordReset.init(data.componentID, data.message.param)
                            break
                        case "action":
                            passwordReset.handleRequest(data.componentID, data.message.request)
                            break
                        default:
                            assertNever(data.message)
                    }
                    break

                case "loginIDField":
                    switch (data.response.type) {
                        case "content":
                            loginID.resolve(data.handlerID, data.response.content)
                            break
                    }
                    break

                case "passwordField":
                    switch (data.response.type) {
                        case "content":
                            password.resolve(data.handlerID, data.response.content)
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

    handler: Record<number, Post<T>> = {}

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
}>

function initResolverSet(): ResolverSet {
    const handlerID = new IDGenerator()

    return {
        credential: {
            store: new Resolver(handlerID),
        },
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
