import { View, AuthComponentFactorySet } from "../view"
import {
    initRenewCredentialComponentSet,
    initLoginIDFieldComponent,
    initPasswordFieldComponent,
} from "../core"

import {
    ForegroundMessage,
    BackgroundMessage,
    PasswordLoginComponentProxyMessage,
    PasswordLoginComponentProxyResponse,
    PasswordResetSessionComponentProxyMessage,
    PasswordResetSessionComponentProxyResponse,
    PasswordResetComponentProxyMessage,
    PasswordResetComponentProxyResponse,
    LoginIDFieldComponentRequest,
    LoginIDFieldComponentResponse,
    PasswordFieldComponentRequest,
    PasswordFieldComponentResponse,
    StoreActionRequest,
    StoreActionResponse,
} from "./data"

import { AppHrefFactory } from "../../../href"
import { AuthViewFactory } from "../../view"

import { RenewCredentialComponentFactory } from "../../component/renew_credential/component"
import {
    PasswordLoginComponent,
    PasswordLoginState,
    PasswordLoginParam,
} from "../../component/password_login/component"
import {
    PasswordResetSessionComponent,
    PasswordResetSessionState,
} from "../../component/password_reset_session/component"
import {
    PasswordResetParam,
    PasswordResetComponent,
    PasswordResetState,
} from "../../component/password_reset/component"

import {
    LoginIDFieldComponentFactory,
    LoginIDFieldComponent,
} from "../../component/field/login_id/component"
import {
    PasswordFieldComponentFactory,
    PasswordFieldComponent,
} from "../../component/field/password/component"

import { SecureScriptPathAction } from "../../../application/action"
import { RenewAction, SetContinuousRenewAction, StoreAction } from "../../../credential/action"

import { LoginIDFieldAction } from "../../../login_id/field/action"
import { PasswordFieldAction } from "../../../password/field/action"

class ComponentProxyMap<F, M, R> {
    components: Record<number, ComponentProxy<F, M, R>> = {}

    post: ProxyMessagePost<M>
    factory: Factory<ComponentProxy<F, M, R>>

    constructor(post: ProxyMessagePost<M>, factory: Factory<ComponentProxy<F, M, R>>) {
        this.post = post
        this.factory = factory
    }

    initFactory(componentID: number): F {
        const proxy = this.factory()
        this.components[componentID] = proxy
        return proxy.initFactory(this.post(componentID))
    }
    handleResponse(componentID: number, response: R): void {
        if (this.components[componentID]) {
            this.components[componentID].handleResponse(response)
        } else {
            throw new Error("component is not initialized")
        }
    }
}
interface ProxyMessagePost<M> {
    (componentID: number): Post<M>
}
interface ComponentProxy<F, M, R> {
    initFactory(post: Post<M>): F
    handleResponse(response: R): void
}

interface PasswordLoginComponentProxyFactory {
    (param: PasswordLoginParam): PasswordLoginComponent
}

class PasswordLoginComponentProxyMap extends ComponentProxyMap<
    PasswordLoginComponentProxyFactory,
    PasswordLoginComponentProxyMessage,
    PasswordLoginComponentProxyResponse
> {
    constructor(post: ProxyMessagePost<PasswordLoginComponentProxyMessage>) {
        super(post, () => new PasswordLoginComponentProxy())
    }
}
class PasswordLoginComponentProxy {
    listener: Post<PasswordLoginState>[] = []

    initFactory(post: Post<PasswordLoginComponentProxyMessage>): PasswordLoginComponentProxyFactory {
        return (param) => {
            post({ type: "init", param })
            return {
                action: (request) => {
                    post({ type: "action", request })
                },
                onStateChange: (post) => {
                    this.listener.push(post)
                },
            }
        }
    }
    handleResponse(response: PasswordLoginComponentProxyResponse): void {
        this.listener.forEach((post) => post(response.state))
    }
}

interface PasswordResetSessionComponentProxyFactory {
    (): PasswordResetSessionComponent
}

class PasswordResetSessionComponentProxyMap extends ComponentProxyMap<
    PasswordResetSessionComponentProxyFactory,
    PasswordResetSessionComponentProxyMessage,
    PasswordResetSessionComponentProxyResponse
> {
    constructor(post: ProxyMessagePost<PasswordResetSessionComponentProxyMessage>) {
        super(post, () => new PasswordResetSessionComponentProxy())
    }
}
class PasswordResetSessionComponentProxy {
    listener: Post<PasswordResetSessionState>[] = []

    initFactory(
        post: Post<PasswordResetSessionComponentProxyMessage>
    ): PasswordResetSessionComponentProxyFactory {
        return () => {
            post({ type: "init" })
            return {
                action: (request) => {
                    post({ type: "action", request })
                },
                onStateChange: (post) => {
                    this.listener.push(post)
                },
            }
        }
    }
    handleResponse(response: PasswordResetSessionComponentProxyResponse): void {
        this.listener.forEach((post) => post(response.state))
    }
}

interface PasswordResetComponentProxyFactory {
    (param: PasswordResetParam): PasswordResetComponent
}

class PasswordResetComponentProxyMap extends ComponentProxyMap<
    PasswordResetComponentProxyFactory,
    PasswordResetComponentProxyMessage,
    PasswordResetComponentProxyResponse
> {
    constructor(post: ProxyMessagePost<PasswordResetComponentProxyMessage>) {
        super(post, () => new PasswordResetComponentProxy())
    }
}
class PasswordResetComponentProxy {
    listener: Post<PasswordResetState>[] = []

    initFactory(post: Post<PasswordResetComponentProxyMessage>): PasswordResetComponentProxyFactory {
        return (param) => {
            post({ type: "init", param })
            return {
                action: (request) => {
                    post({ type: "action", request })
                },
                onStateChange: (post) => {
                    this.listener.push(post)
                },
            }
        }
    }
    handleResponse(response: PasswordResetComponentProxyResponse): void {
        this.listener.forEach((post) => post(response.state))
    }
}

class ComponentMap<C, R, M> {
    map: Record<number, C> = {}

    factory: Factory<C>
    post: ComponentResponsePost<M>
    handler: ComponentRequestHandler<C, R, M>

    constructor(
        factory: Factory<C>,
        post: ComponentResponsePost<M>,
        handler: ComponentRequestHandler<C, R, M>
    ) {
        this.factory = factory
        this.post = post
        this.handler = handler
    }

    init(componentID: number): C {
        const component = this.factory()
        this.map[componentID] = component
        return component
    }
    handleRequest(componentID: number, handlerID: number, request: R) {
        if (this.map[componentID]) {
            this.handler(this.map[componentID], this.post(componentID, handlerID), request)
        } else {
            throw new Error("component is not initialized")
        }
    }
}
interface ComponentResponsePost<M> {
    (componentID: number, handlerID: number): Post<M>
}
interface ComponentRequestHandler<C, R, M> {
    (component: C, post: Post<M>, request: R): void
}

class LoginIDFieldComponentMap extends ComponentMap<
    LoginIDFieldComponent,
    LoginIDFieldComponentRequest,
    LoginIDFieldComponentResponse
> {
    constructor(
        factory: Factory<LoginIDFieldComponent>,
        post: ComponentResponsePost<LoginIDFieldComponentResponse>
    ) {
        super(factory, post, (component, post, request) => {
            switch (request.type) {
                case "validate":
                    component.validate((event) => {
                        post({ type: "content", content: event.content })
                    })
                    break
            }
        })
    }
}

class PasswordFieldComponentMap extends ComponentMap<
    PasswordFieldComponent,
    PasswordFieldComponentRequest,
    PasswordFieldComponentResponse
> {
    constructor(
        factory: Factory<PasswordFieldComponent>,
        post: ComponentResponsePost<PasswordFieldComponentResponse>
    ) {
        super(factory, post, (component, post, request) => {
            switch (request.type) {
                case "validate":
                    component.validate((event) => {
                        post({ type: "content", content: event.content })
                    })
                    break
            }
        })
    }
}

class StoreActionMap extends ComponentMap<StoreAction, StoreActionRequest, StoreActionResponse> {
    constructor(factory: Factory<StoreAction>, post: ComponentResponsePost<StoreActionResponse>) {
        super(factory, post, (component, post, authCredential) => {
            component(authCredential, post)
        })
    }
}

export type FactorySet = Readonly<{
    actions: Readonly<{
        application: Readonly<{
            secureScriptPath: Factory<SecureScriptPathAction>
        }>
        credential: Readonly<{
            renew: Factory<RenewAction>
            setContinuousRenew: Factory<SetContinuousRenewAction>
            store: Factory<StoreAction>
        }>

        field: Readonly<{
            loginID: Factory<LoginIDFieldAction>
            password: Factory<PasswordFieldAction>
        }>
    }>
    components: Readonly<{
        href: AppHrefFactory

        renewCredential: RenewCredentialComponentFactory

        field: Readonly<{
            loginID: LoginIDFieldComponentFactory
            password: PasswordFieldComponentFactory
        }>
    }>
}>

export function initAuthViewFactoryAsForeground(worker: Worker, factory: FactorySet): AuthViewFactory {
    return (currentLocation) => {
        const map = initAuthComponentMapSet(factory, postForegroundMessage)
        const view = new View(currentLocation, initAuthComponentFactorySet(factory, map))
        const errorHandler = (err: string) => {
            view.error(err)
        }
        const messageHandler = initBackgroundMessageHandler(map, errorHandler)

        worker.addEventListener("message", (event) => {
            messageHandler(event.data)
        })

        return {
            view,
            terminate,
        }

        function postForegroundMessage(message: ForegroundMessage) {
            worker.postMessage(message)
        }
        function terminate() {
            worker.terminate()
        }
    }
}
type AuthComponentMapSet = Readonly<{
    components: Readonly<{
        passwordLogin: PasswordLoginComponentProxyMap
        passwordResetSession: PasswordResetSessionComponentProxyMap
        passwordReset: PasswordResetComponentProxyMap

        fields: Readonly<{
            loginIDField: LoginIDFieldComponentMap
            passwordField: PasswordFieldComponentMap
        }>
    }>
    actions: Readonly<{
        credential: Readonly<{
            store: StoreActionMap
        }>
    }>
}>
function initAuthComponentMapSet(
    factory: FactorySet,
    post: Post<ForegroundMessage>
): AuthComponentMapSet {
    return {
        components: {
            passwordLogin: new PasswordLoginComponentProxyMap((componentID) => (message) => {
                post({ type: "passwordLogin", componentID, message })
            }),
            passwordResetSession: new PasswordResetSessionComponentProxyMap(
                (componentID) => (message) => {
                    post({ type: "passwordResetSession", componentID, message })
                }
            ),
            passwordReset: new PasswordResetComponentProxyMap((componentID) => (message) => {
                post({ type: "passwordReset", componentID, message })
            }),

            fields: {
                loginIDField: new LoginIDFieldComponentMap(
                    () => initLoginIDFieldComponent(factory),
                    (componentID, handlerID) => (response) => {
                        post({
                            type: "loginIDField",
                            componentID,
                            handlerID,
                            response,
                        })
                    }
                ),
                passwordField: new PasswordFieldComponentMap(
                    () => initPasswordFieldComponent(factory),
                    (componentID, handlerID) => (response) => {
                        post({
                            type: "passwordField",
                            componentID,
                            handlerID,
                            response,
                        })
                    }
                ),
            },
        },
        actions: {
            credential: {
                store: new StoreActionMap(
                    () => factory.actions.credential.store(),
                    (actionID, handlerID) => (response) => {
                        post({
                            type: "credential-store",
                            actionID,
                            handlerID,
                            response,
                        })
                    }
                ),
            },
        },
    }
}
function initAuthComponentFactorySet(
    factory: FactorySet,
    map: AuthComponentMapSet
): AuthComponentFactorySet {
    const componentIDGenerator = new IDGenerator()

    return {
        renewCredential(param, setup) {
            return initRenewCredentialComponentSet(factory, param, setup)
        },

        passwordLogin(param) {
            const componentID = componentIDGenerator.generate()
            return {
                href: factory.components.href(),
                passwordLogin: map.components.passwordLogin.initFactory(componentID)(param),
                loginIDField: map.components.fields.loginIDField.init(componentID),
                passwordField: map.components.fields.passwordField.init(componentID),
            }
        },
        passwordResetSession() {
            const componentID = componentIDGenerator.generate()
            return {
                href: factory.components.href(),
                passwordResetSession: map.components.passwordResetSession.initFactory(componentID)(),
                loginIDField: map.components.fields.loginIDField.init(componentID),
            }
        },
        passwordReset: (param) => {
            const componentID = componentIDGenerator.generate()
            return {
                href: factory.components.href(),
                passwordReset: map.components.passwordReset.initFactory(componentID)(param),
                loginIDField: map.components.fields.loginIDField.init(componentID),
                passwordField: map.components.fields.passwordField.init(componentID),
            }
        },
    }
}
function initBackgroundMessageHandler(
    map: AuthComponentMapSet,
    errorHandler: Post<string>
): Post<BackgroundMessage> {
    return (message) => {
        try {
            switch (message.type) {
                case "passwordLogin":
                    map.components.passwordLogin.handleResponse(message.componentID, message.response)
                    break

                case "passwordResetSession":
                    map.components.passwordResetSession.handleResponse(
                        message.componentID,
                        message.response
                    )
                    break

                case "passwordReset":
                    map.components.passwordReset.handleResponse(message.componentID, message.response)
                    break

                case "credential-store":
                    switch (message.message.type) {
                        case "init":
                            map.actions.credential.store.init(message.actionID)
                            break
                        case "action":
                            map.actions.credential.store.handleRequest(
                                message.actionID,
                                message.message.handlerID,
                                message.message.authCredential
                            )
                            break
                        default:
                            assertNever(message.message)
                    }
                    break

                case "loginIDField":
                    map.components.fields.loginIDField.handleRequest(
                        message.componentID,
                        message.handlerID,
                        message.request
                    )
                    break

                case "passwordField":
                    map.components.fields.passwordField.handleRequest(
                        message.componentID,
                        message.handlerID,
                        message.request
                    )
                    break

                case "error":
                    errorHandler(message.err)
                    break

                default:
                    assertNever(message)
            }
        } catch (err) {
            errorHandler(`${err}`)
        }
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

function assertNever(_: never): never {
    throw new Error("NEVER")
}
