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

class ActionProxyMap<M, R> {
    handler: Record<number, Post<R>> = {}

    idGenerator: IDGenerator

    post: ActionPost<M>

    constructor(post: ActionPost<M>) {
        this.idGenerator = new IDGenerator()
        this.post = post
    }

    register(handlerID: number, post: Post<R>): void {
        this.handler[handlerID] = post
    }
    resolve(handlerID: number, response: R): void {
        if (this.handler[handlerID]) {
            this.handler[handlerID](response)
            delete this.handler[handlerID]
        } else {
            throw new Error("handler is not found")
        }
    }
}
interface ActionPost<M> {
    (actionID: number): Post<M>
}

class StoreActionProxyMap extends ActionProxyMap<StoreActionProxyMessage, StoreEvent> {
    initFactory(actionID: number): Factory<StoreAction> {
        const postActionMessage = this.post(actionID)
        postActionMessage({ type: "init" })

        return () => (authCredential: AuthCredential, post: Post<StoreEvent>) => {
            const handlerID = this.idGenerator.generate()
            this.register(handlerID, post)
            postActionMessage({ type: "action", handlerID, authCredential })
        }
    }
}

type StoreActionProxyMessage =
    | Readonly<{ type: "init" }>
    | Readonly<{ type: "action"; handlerID: number; authCredential: AuthCredential }>

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
    const storeAction = new StoreActionProxyMap((actionID) => (message) => {
        switch (message.type) {
            case "init":
                postBackgroundMessage({ type: "credential-store-init", actionID })
                break
            case "action":
                postBackgroundMessage({
                    type: "credential-store",
                    actionID,
                    handlerID: message.handlerID,
                    request: message.authCredential,
                })
                break
        }
    })
    
    const actionID = new IDGenerator()
    const proxy = {
        credential: {
            store: storeAction.initFactory(actionID.generate()),
        },
    }

    const loginIDCollector = new LoginIDCollectorMap((componentID, handlerID) => (request) => {
        postBackgroundMessage({
            type: "loginIDField",
            componentID,
            handlerID,
            request,
        })
    })
    const passwordCollector = new PasswordCollectorMap((componentID, handlerID) => (request) => {
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
                    loginID: loginIDCollector.init(componentID, (post) => {
                        post({ type: "validate" })
                    }),
                    password: passwordCollector.init(componentID, (post) => {
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
                    loginID: loginIDCollector.init(componentID, (post) => {
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
                    loginID: loginIDCollector.init(componentID, (post) => {
                        post({ type: "validate" })
                    }),
                    password: passwordCollector.init(componentID, (post) => {
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
                            loginIDCollector.resolve(data.handlerID, data.response.content)
                            break
                    }
                    break

                case "passwordField":
                    switch (data.response.type) {
                        case "content":
                            passwordCollector.resolve(data.handlerID, data.response.content)
                            break
                    }
                    break

                case "credential-store":
                    storeAction.resolve(data.handlerID, data.response)
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
