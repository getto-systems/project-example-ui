import { View, AuthComponentSetInit } from "../view"
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

import { AppHrefInit } from "../../../href"
import { AuthInit } from "../../view"

import { RenewCredentialInit } from "../../component/renew_credential/component"
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

import { LoginIDFieldInit, LoginIDFieldComponent } from "../../component/field/login_id/component"
import { PasswordFieldInit, PasswordFieldComponent } from "../../component/field/password/component"

import { SecureScriptPathAction } from "../../../application/action"
import { RenewAction, SetContinuousRenewAction, StoreAction } from "../../../credential/action"

import { LoginIDFieldAction } from "../../../login_id/field/action"
import { PasswordFieldAction } from "../../../password/field/action"

class ComponentProxyMap<F, M, R> {
    components: Record<number, ComponentProxy<F, M, R>> = []

    post: PostProxyMessage<M>
    factory: Factory<ComponentProxy<F, M, R>>

    constructor(post: PostProxyMessage<M>, factory: Factory<ComponentProxy<F, M, R>>) {
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
interface PostProxyMessage<M> {
    (componentID: number): Post<M>
}
interface ComponentProxy<F, M, R> {
    initFactory(post: Post<M>): F
    handleResponse(response: R): void
}

interface PasswordLoginComponentFactory {
    (param: PasswordLoginParam): PasswordLoginComponent
}

class PasswordLoginComponentProxyMap extends ComponentProxyMap<
    PasswordLoginComponentFactory,
    PasswordLoginComponentProxyMessage,
    PasswordLoginComponentProxyResponse
> {
    constructor(post: PostProxyMessage<PasswordLoginComponentProxyMessage>) {
        super(post, () => new PasswordLoginComponentProxy())
    }
}
class PasswordLoginComponentProxy {
    listener: Post<PasswordLoginState>[] = []

    initFactory(post: Post<PasswordLoginComponentProxyMessage>): PasswordLoginComponentFactory {
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

interface PasswordResetSessionComponentFactory {
    (): PasswordResetSessionComponent
}

class PasswordResetSessionComponentProxyMap extends ComponentProxyMap<
    PasswordResetSessionComponentFactory,
    PasswordResetSessionComponentProxyMessage,
    PasswordResetSessionComponentProxyResponse
> {
    constructor(post: PostProxyMessage<PasswordResetSessionComponentProxyMessage>) {
        super(post, () => new PasswordResetSessionComponentProxy())
    }
}
class PasswordResetSessionComponentProxy {
    listener: Post<PasswordResetSessionState>[] = []

    initFactory(
        post: Post<PasswordResetSessionComponentProxyMessage>
    ): PasswordResetSessionComponentFactory {
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

interface PasswordResetComponentFactory {
    (param: PasswordResetParam): PasswordResetComponent
}

class PasswordResetComponentProxyMap extends ComponentProxyMap<
    PasswordResetComponentFactory,
    PasswordResetComponentProxyMessage,
    PasswordResetComponentProxyResponse
> {
    constructor(post: PostProxyMessage<PasswordResetComponentProxyMessage>) {
        super(post, () => new PasswordResetComponentProxy())
    }
}
class PasswordResetComponentProxy {
    listener: Post<PasswordResetState>[] = []

    initFactory(post: Post<PasswordResetComponentProxyMessage>): PasswordResetComponentFactory {
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
    map: Record<number, C> = []

    factory: Factory<C>
    post: PostComponentResponse<M>
    handler: ComponentRequestHandler<C, R, M>

    constructor(
        factory: Factory<C>,
        post: PostComponentResponse<M>,
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
interface PostComponentResponse<M> {
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
        post: PostComponentResponse<LoginIDFieldComponentResponse>
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
        post: PostComponentResponse<PasswordFieldComponentResponse>
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
    constructor(factory: Factory<StoreAction>, post: PostComponentResponse<StoreActionResponse>) {
        super(factory, post, (component, post, authCredential) => {
            component(authCredential, post)
        })
    }
}

// TODO factory と init をなんとかする
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

export function initAuthInitAsWorker(worker: Worker, factory: FactorySet, init: InitSet): AuthInit {
    return (currentLocation) => {
        const map = initAuthComponentMapSet(factory, init, postForegroundMessage)
        const view = new View(currentLocation, initAuthComponentSetInit(factory, init, map))
        const handleError = (err: string) => {
            view.error(err)
        }

        worker.addEventListener("message", initBackgroundMessageHandler(map, handleError))

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
    init: InitSet,
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
                    () => initLoginIDFieldComponent(factory, init),
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
                    () => initPasswordFieldComponent(factory, init),
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
                    () => factory.credential.store(),
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
function initAuthComponentSetInit(
    factory: FactorySet,
    init: InitSet,
    map: AuthComponentMapSet
): AuthComponentSetInit {
    const componentIDGenerator = new IDGenerator()

    return {
        renewCredential(param, setup) {
            return initRenewCredentialComponentSet(factory, init, param, setup)
        },

        passwordLogin(param) {
            const componentID = componentIDGenerator.generate()
            return {
                href: init.href(),
                passwordLogin: map.components.passwordLogin.initFactory(componentID)(param),
                loginIDField: map.components.fields.loginIDField.init(componentID),
                passwordField: map.components.fields.passwordField.init(componentID),
            }
        },
        passwordResetSession() {
            const componentID = componentIDGenerator.generate()
            return {
                href: init.href(),
                passwordResetSession: map.components.passwordResetSession.initFactory(componentID)(),
                loginIDField: map.components.fields.loginIDField.init(componentID),
            }
        },
        passwordReset: (param) => {
            const componentID = componentIDGenerator.generate()
            return {
                href: init.href(),
                passwordReset: map.components.passwordReset.initFactory(componentID)(param),
                loginIDField: map.components.fields.loginIDField.init(componentID),
                passwordField: map.components.fields.passwordField.init(componentID),
            }
        },
    }
}
function initBackgroundMessageHandler(
    map: AuthComponentMapSet,
    handleError: Post<string>
): Post<MessageEvent<BackgroundMessage>> {
    return (event) => {
        try {
            const data = event.data
            switch (data.type) {
                case "passwordLogin":
                    map.components.passwordLogin.handleResponse(data.componentID, data.response)
                    break

                case "passwordResetSession":
                    map.components.passwordResetSession.handleResponse(data.componentID, data.response)
                    break

                case "passwordReset":
                    map.components.passwordReset.handleResponse(data.componentID, data.response)
                    break

                case "credential-store-init":
                    map.actions.credential.store.init(data.actionID)
                    break

                case "credential-store":
                    map.actions.credential.store.handleRequest(
                        data.actionID,
                        data.handlerID,
                        data.request
                    )
                    break

                case "loginIDField":
                    map.components.fields.loginIDField.handleRequest(
                        data.componentID,
                        data.handlerID,
                        data.request
                    )
                    break

                case "passwordField":
                    map.components.fields.passwordField.handleRequest(
                        data.componentID,
                        data.handlerID,
                        data.request
                    )
                    break

                case "error":
                    handleError(data.err)
                    break

                default:
                    assertNever(data)
            }
        } catch (err) {
            handleError(`${err}`)
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
