import { View, AuthComponentSetInit } from "./view"
import {
    initRenewCredentialComponentSet,
    initLoginIDFieldComponent,
    initPasswordFieldComponent,
} from "./core"

import { AppHrefInit } from "../../href"
import { AuthInit } from "../view"

import { RenewCredentialInit } from "../component/renew_credential/component"
import {
    PasswordLoginInit,
    PasswordLoginComponent,
    PasswordLoginState,
    PasswordLoginParam,
    PasswordLoginRequest,
} from "../component/password_login/component"
import {
    PasswordResetSessionInit,
    PasswordResetSessionComponent,
    PasswordResetSessionState,
    PasswordResetSessionRequest,
} from "../component/password_reset_session/component"
import {
    PasswordResetInit,
    PasswordResetParam,
    PasswordResetComponent,
    PasswordResetState,
    PasswordResetRequest,
} from "../component/password_reset/component"

import { LoginIDFieldInit, LoginIDFieldComponent } from "../component/field/login_id/component"
import { PasswordFieldInit, PasswordFieldComponent } from "../component/field/password/component"

import { SecureScriptPathAction } from "../../application/action"
import { RenewAction, SetContinuousRenewAction, StoreAction } from "../../credential/action"

import { LoginAction, LoginFieldCollector } from "../../password_login/action"
import {
    StartSessionAction,
    StartSessionFieldCollector,
    PollingStatusAction,
    ResetAction,
    ResetFieldCollector,
} from "../../password_reset/action"

import { LoginIDFieldAction } from "../../login_id/field/action"
import { PasswordFieldAction } from "../../password/field/action"

import { AuthCredential, StoreEvent } from "../../credential/data"
import { LoginID } from "../../login_id/data"
import { LoginIDFieldEvent } from "../../login_id/field/data"
import { Password } from "../../password/data"
import { PasswordFieldEvent } from "../../password/field/data"
import { Content } from "../../field/data"

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
        return proxy.init(this.post(componentID))
    }
    handleResponse(componentID: number, response: R): void {
        if (this.components[componentID]) {
            this.components[componentID].handleResponse(response)
        } else {
            throw new Error("component is not initialized")
        }
    }
}
interface ComponentProxy<F, M, R> {
    init(post: Post<M>): F
    handleResponse(response: R): void
}
interface PostProxyMessage<M> {
    (componentID: number): { (message: M): void }
}

interface PasswordLoginComponentFactory {
    (param: PasswordLoginParam): PasswordLoginComponent
}

type PasswordLoginComponentProxyMessage =
    | Readonly<{ type: "init"; param: PasswordLoginParam }>
    | Readonly<{ type: "action"; request: PasswordLoginRequest }>

type PasswordLoginComponentProxyResponse = Readonly<{ type: "post"; state: PasswordLoginState }>

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

    init(post: Post<PasswordLoginComponentProxyMessage>): PasswordLoginComponentFactory {
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

type PasswordResetSessionComponentProxyMessage =
    | Readonly<{ type: "init" }>
    | Readonly<{ type: "action"; request: PasswordResetSessionRequest }>

type PasswordResetSessionComponentProxyResponse = Readonly<{
    type: "post"
    state: PasswordResetSessionState
}>

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

    init(post: Post<PasswordResetSessionComponentProxyMessage>): PasswordResetSessionComponentFactory {
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

type PasswordResetComponentProxyMessage =
    | Readonly<{ type: "init"; param: PasswordResetParam }>
    | Readonly<{ type: "action"; request: PasswordResetRequest }>

type PasswordResetComponentProxyResponse = Readonly<{ type: "post"; state: PasswordResetState }>

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

    init(post: Post<PasswordResetComponentProxyMessage>): PasswordResetComponentFactory {
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

class ComponentMap<C> {
    map: Record<number, C> = []

    factory: Factory<C>

    constructor(factory: Factory<C>) {
        this.factory = factory
    }

    init(componentID: number): C {
        const component = this.factory()
        this.map[componentID] = component
        return component
    }
}

class LoginIDFieldComponentMap extends ComponentMap<LoginIDFieldComponent> {
    validate(componentID: number, post: Post<LoginIDFieldEvent>): void {
        if (this.map[componentID]) {
            this.map[componentID].validate(post)
        } else {
            throw new Error("component is not initialized")
        }
    }
}
class PasswordFieldComponentMap extends ComponentMap<PasswordFieldComponent> {
    validate(componentID: number, post: Post<PasswordFieldEvent>): void {
        if (this.map[componentID]) {
            this.map[componentID].validate(post)
        } else {
            throw new Error("component is not initialized")
        }
    }
}

class StoreActionMap extends ComponentMap<StoreAction> {
    action(actionID: number, authCredential: AuthCredential, post: Post<StoreEvent>): void {
        if (this.map[actionID]) {
            this.map[actionID](authCredential, post)
        }
    }
}

export function initAuthInitAsWorker(worker: Worker, factory: FactorySet, init: InitSet): AuthInit {
    return (currentLocation) => {
        const map = initAuthComponentMap(factory, init, postWorkerRequest)
        const view = new View(currentLocation, initAuthComponentSetInit(factory, init, map))
        const handleError = (err: string) => {
            view.error(err)
        }

        worker.addEventListener("message", initHandleWorkerEvent(map, postWorkerRequest, handleError))

        return {
            view,
            terminate,
        }

        function postWorkerRequest(request: WorkerRequest) {
            worker.postMessage(request)
        }
        function terminate() {
            worker.terminate()
        }
    }
}
type AuthComponentMap = Readonly<{
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
function initAuthComponentMap(
    factory: FactorySet,
    init: InitSet,
    postWorkerRequest: Post<WorkerRequest>
): AuthComponentMap {
    return {
        components: {
            passwordLogin: new PasswordLoginComponentProxyMap((componentID) => (message) => {
                postWorkerRequest({ type: "passwordLogin", componentID, message })
            }),
            passwordResetSession: new PasswordResetSessionComponentProxyMap(
                (componentID) => (message) => {
                    postWorkerRequest({ type: "passwordResetSession", componentID, message })
                }
            ),
            passwordReset: new PasswordResetComponentProxyMap((componentID) => (message) => {
                postWorkerRequest({ type: "passwordReset", componentID, message })
            }),

            fields: {
                loginIDField: new LoginIDFieldComponentMap(() =>
                    initLoginIDFieldComponent(factory, init)
                ),
                passwordField: new PasswordFieldComponentMap(() =>
                    initPasswordFieldComponent(factory, init)
                ),
            },
        },
        actions: {
            credential: {
                store: new StoreActionMap(() => factory.credential.store()),
            },
        },
    }
}
function initAuthComponentSetInit(
    factory: FactorySet,
    init: InitSet,
    map: AuthComponentMap
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
function initHandleWorkerEvent(
    map: AuthComponentMap,
    postWorkerRequest: Post<WorkerRequest>,
    handleError: Post<string>
): { (event: MessageEvent<WorkerEvent>): void } {
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

                case "credential-store-action":
                    map.actions.credential.store.action(data.actionID, data.authCredential, (event) => {
                        postWorkerRequest({
                            type: "credential-store-post",
                            actionID: data.actionID,
                            handlerID: data.handlerID,
                            event,
                        })
                    })
                    break

                case "loginIDField-validate":
                    map.components.fields.loginIDField.validate(data.componentID, (event) => {
                        postWorkerRequest({
                            type: "loginIDField-content",
                            componentID: data.componentID,
                            handlerID: data.handlerID,
                            content: event.content,
                        })
                    })
                    break

                case "passwordField-validate":
                    map.components.fields.passwordField.validate(data.componentID, (event) => {
                        postWorkerRequest({
                            type: "passwordField-content",
                            componentID: data.componentID,
                            handlerID: data.handlerID,
                            content: event.content,
                        })
                    })
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

    const passwordLogin = new PasswordLoginComponentMap(resolver, postWorkerEvent)
    const passwordResetSession = new PasswordResetSessionComponentMap(resolver, postWorkerEvent)
    const passwordReset = new PasswordResetComponentMap(resolver, postWorkerEvent)

    const actionID = new IDGenerator()
    const storeAction = new StoreActionProxy(actionID, resolver.credential.store, postWorkerEvent)

    const proxy = {
        credential: {
            store: () => storeAction.init(),
        },
    }

    worker.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
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

function collectLoginID(
    componentID: number,
    resolver: Resolver<Content<LoginID>>,
    post: Post<WorkerEvent>
): { (): Promise<Content<LoginID>> } {
    return () =>
        new Promise((resolve) => {
            post({
                type: "loginIDField-validate",
                componentID,
                handlerID: resolver.register(resolve),
            })
        })
}
function collectPassword(
    componentID: number,
    resolver: Resolver<Content<Password>>,
    post: Post<WorkerEvent>
): { (): Promise<Content<Password>> } {
    return () =>
        new Promise((resolve) => {
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
    post: Post<WorkerEvent>

    constructor(resolver: ResolverSet, post: Post<WorkerEvent>) {
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
    post: Post<WorkerEvent>

    constructor(resolver: ResolverSet, post: Post<WorkerEvent>) {
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
    post: Post<WorkerEvent>

    constructor(actionID: IDGenerator, resolver: Resolver<StoreEvent>, post: Post<WorkerEvent>) {
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
                handlerID: this.resolver.register(postStoreEvent),
                authCredential,
            })
        }
    }
}

type WorkerRequest =
    | Readonly<{
          type: "passwordLogin"
          componentID: number
          message: PasswordLoginComponentProxyMessage
      }>
    | Readonly<{
          type: "passwordResetSession"
          componentID: number
          message: PasswordResetSessionComponentProxyMessage
      }>
    | Readonly<{
          type: "passwordReset"
          componentID: number
          message: PasswordResetComponentProxyMessage
      }>
    | Readonly<{
          type: "loginIDField-content"
          componentID: number
          handlerID: number
          content: Content<LoginID>
      }>
    | Readonly<{
          type: "passwordField-content"
          componentID: number
          handlerID: number
          content: Content<Password>
      }>
    | Readonly<{ type: "credential-store-post"; actionID: number; handlerID: number; event: StoreEvent }>

type WorkerEvent =
    | Readonly<{ type: "credential-store-init"; actionID: number }>
    | Readonly<{
          type: "credential-store-action"
          actionID: number
          handlerID: number
          authCredential: AuthCredential
      }>
    | Readonly<{
          type: "passwordLogin"
          componentID: number
          response: PasswordLoginComponentProxyResponse
      }>
    | Readonly<{
          type: "passwordResetSession"
          componentID: number
          response: PasswordResetSessionComponentProxyResponse
      }>
    | Readonly<{
          type: "passwordReset"
          componentID: number
          response: PasswordResetComponentProxyResponse
      }>
    | Readonly<{ type: "loginIDField-validate"; componentID: number; handlerID: number }>
    | Readonly<{ type: "passwordField-validate"; componentID: number; handlerID: number }>
    | Readonly<{ type: "error"; err: string }>

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
