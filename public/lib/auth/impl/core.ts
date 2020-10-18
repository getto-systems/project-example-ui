import { packResetToken } from "../../password_reset/adapter"
import { packPagePathname } from "../../application/adapter"

import { AppHrefInit } from "../../href"
import {
    AuthInit,
    AuthView,
    AuthState,
    AuthComponentSet,
} from "../view"

import { RenewCredentialInit, RenewCredentialComponent } from "../component/renew_credential/component"
import { PasswordLoginInit, PasswordLoginComponent, PasswordLoginState, PasswordLoginParam, PasswordLoginRequest } from "../component/password_login/component"
import { PasswordResetSessionInit, /* PasswordResetSessionComponent, PasswordResetSessionRequest */ } from "../component/password_reset_session/component"
import { PasswordResetInit, /* PasswordResetComponent, PasswordResetParam, PasswordResetRequest */ } from "../component/password_reset/component"

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
import { Password } from "../../password/data"
import { ResetToken } from "../../password_reset/data"
import { Content } from "../../field/data"

// ログイン前画面ではアンダースコアから始まるクエリを使用する
const SEARCH = {
    passwordReset: "_password_reset",
    passwordResetToken: "_password_reset_token",
}

function detectLoginState(currentLocation: Location): AuthState {
    const url = new URL(currentLocation.toString())

    // パスワードリセット
    switch (url.searchParams.get(SEARCH.passwordReset)) {
        case "start":
            return { type: "password-reset-session" }
        case "reset":
            return { type: "password-reset" }
    }

    // 特に指定が無ければパスワードログイン
    return { type: "password-login" }
}
function detectPasswordResetToken(currentLocation: Location): ResetToken {
    const url = new URL(currentLocation.toString())
    return packResetToken(url.searchParams.get(SEARCH.passwordResetToken) || "")
}

type FactorySet = Readonly<{
    application: {
        secureScriptPath: Factory<SecureScriptPathAction>
    }
    credential: {
        renew: Factory<RenewAction>
        setContinuousRenew: Factory<SetContinuousRenewAction>
        store: Factory<StoreAction>
    }

    passwordLogin: {
        login: ParameterFactory<LoginFieldCollector, LoginAction>
    }
    passwordReset: {
        startSession: ParameterFactory<StartSessionFieldCollector, StartSessionAction>
        pollingStatus: Factory<PollingStatusAction>
        reset: ParameterFactory<ResetFieldCollector, ResetAction>
    }

    field: {
        loginID: Factory<LoginIDFieldAction>
        password: Factory<PasswordFieldAction>
    }
}>

type InitSet = Readonly<{
    href: AppHrefInit

    renewCredential: RenewCredentialInit

    passwordLogin: PasswordLoginInit
    passwordResetSession: PasswordResetSessionInit
    passwordReset: PasswordResetInit

    field: {
        loginID: LoginIDFieldInit
        password: PasswordFieldInit
    }
}>

type WorkerFactory = Readonly<{
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

    field: {
        loginID: Factory<LoginIDFieldAction>
        password: Factory<PasswordFieldAction>
    }
}>

type WorkerInit = Readonly<{
    passwordLogin: PasswordLoginInit
    passwordResetSession: PasswordResetSessionInit
    passwordReset: PasswordResetInit

    field: {
        loginID: LoginIDFieldInit
        password: PasswordFieldInit
    }
}>

export function initAuthInit(factory: FactorySet, init: InitSet): AuthInit {
    return (currentLocation) => {
        const view = new View(factory, init, currentLocation)
        return {
            view,
            terminate: () => view.terminate(),
        }
    }
}

export function initAuthWorker(factory: WorkerFactory, init: WorkerInit, worker: Worker): void {
    const actionID = new IDGenerator()
    const map: ComponentMap = {
        passwordLogin: [],
    }

    const post: Post<WorkerEvent> = (event) => worker.postMessage(event)

    class StoreActionWorker {
        requestID: IDGenerator

        request: Record<number, Record<number, Post<StoreEvent>>> = []

        constructor() {
            this.requestID = new IDGenerator()
        }

        store(actionID: number, authCredential: AuthCredential, postStoreEvent: Post<StoreEvent>): void {
            if (!this.request[actionID]) {
                this.request[actionID] = []
            }

            const requestID = this.requestID.generate()
            this.request[actionID][requestID] = postStoreEvent

            post({ type: "credential-store-action", actionID, requestID, authCredential })
        }
        resolve({ actionID, requestID, event }: { actionID: number, requestID: number, event: StoreEvent }) {
            if (this.request[actionID] && this.request[actionID][requestID]) {
                this.request[actionID][requestID](event)
                delete this.request[actionID][requestID]
            }
        }
    }

    const storeAction = new StoreActionWorker()

    const storeFactory: Factory<StoreAction> = () => {
        const id = actionID.generate()
        post({ type: "credential-store-init", actionID: id })

        return (authCredential: AuthCredential, postStoreEvent: Post<StoreEvent>) => {
            storeAction.store(id, authCredential, postStoreEvent)
        }
    }

    class LoginIDFieldWorker {
        requestID: IDGenerator

        request: Record<number, Record<number, Post<Content<LoginID>>>> = []

        constructor() {
            this.requestID = new IDGenerator()
        }

        validate(componentID: number, postContent: Post<Content<LoginID>>): void {
            if (!this.request[componentID]) {
                this.request[componentID] = []
            }

            const requestID = this.requestID.generate()
            this.request[componentID][requestID] = postContent

            post({ type: "loginIDField-validate", componentID, requestID })
        }
        resolve({ componentID, requestID, content }: { componentID: number, requestID: number, content: Content<LoginID> }) {
            if (this.request[componentID] && this.request[componentID][requestID]) {
                this.request[componentID][requestID](content)
                delete this.request[componentID][requestID]
            }
        }
    }
    class PasswordFieldWorker {
        requestID: IDGenerator

        request: Record<number, Record<number, Post<Content<Password>>>> = []

        constructor() {
            this.requestID = new IDGenerator()
        }

        validate(componentID: number, postContent: Post<Content<Password>>): void {
            if (!this.request[componentID]) {
                this.request[componentID] = []
            }

            const requestID = this.requestID.generate()
            this.request[componentID][requestID] = postContent

            post({ type: "passwordField-validate", componentID, requestID })
        }
        resolve({ componentID, requestID, content }: { componentID: number, requestID: number, content: Content<Password> }) {
            if (this.request[componentID] && this.request[componentID][requestID]) {
                this.request[componentID][requestID](content)
                delete this.request[componentID][requestID]
            }
        }
    }

    const loginIDField = new LoginIDFieldWorker()
    const passwordField = new PasswordFieldWorker()

    worker.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
        const data = event.data
        switch (data.type) {
            case "passwordLogin-init":
                map.passwordLogin[data.componentID] = initPasswordLoginComponent(storeFactory, factory, init, data.param, {
                    onStateChange(state) {
                        post({ type: "passwordLogin-post", componentID: data.componentID, state })
                    },
                }, {
                    loginID(): Promise<Content<LoginID>> {
                        return new Promise((resolve) => {
                            loginIDField.validate(data.componentID, (content) => {
                                resolve(content)
                            })
                        })
                    },
                    password(): Promise<Content<Password>> {
                        return new Promise((resolve) => {
                            passwordField.validate(data.componentID, (content) => {
                                resolve(content)
                            })
                        })
                    }
                })
                break

            case "passwordLogin-action":
                if (map.passwordLogin[data.componentID]) {
                    map.passwordLogin[data.componentID].action(data.request)
                } else {
                    post({ type: "error", err: "component has not been initialized" })
                }
                break

            case "loginIDField-content":
                loginIDField.resolve(data)
                break

            case "passwordField-content":
                passwordField.resolve(data)
                break

            case "credential-store-post":
                storeAction.resolve(data)
                break
        }
    })
}

class IDGenerator {
    id = 0

    generate(): number {
        this.id += 1
        return this.id
    }
}

interface Component<T> {
    action(request: T): void
}

type ComponentMap = {
    passwordLogin: Record<number, PasswordLoginComponent>
}

type ActionMap = {
    credential: {
        store: Record<number, StoreAction>
    }
}

type WorkerRequest =
    Readonly<{ type: "passwordLogin-init", componentID: number, param: PasswordLoginParam }> |
    Readonly<{ type: "passwordLogin-action", componentID: number, request: PasswordLoginRequest }> |
    Readonly<{ type: "loginIDField-content", componentID: number, requestID: number, content: Content<LoginID> }> |
    Readonly<{ type: "passwordField-content", componentID: number, requestID: number, content: Content<Password> }> |
    Readonly<{ type: "credential-store-post", actionID: number, requestID: number, event: StoreEvent }>

type WorkerEvent =
    Readonly<{ type: "credential-store-init", actionID: number }> |
    Readonly<{ type: "credential-store-action", actionID: number, requestID: number, authCredential: AuthCredential }> |
    Readonly<{ type: "passwordLogin-post", componentID: number, state: PasswordLoginState }> |
    Readonly<{ type: "loginIDField-validate", componentID: number, requestID: number }> |
    Readonly<{ type: "passwordField-validate", componentID: number, requestID: number }> |
    Readonly<{ type: "error", err: string }>

class View implements AuthView {
    listener: Post<AuthState>[] = []

    worker: Worker
    components: AuthComponentSet

    constructor(factory: FactorySet, init: InitSet, currentLocation: Location) {
        const map: ActionMap = {
            credential: {
                store: [],
            },
        }

        this.worker = new Worker("./auth.worker.js")
        const post: Post<WorkerRequest> = (request) => this.worker.postMessage(request)

        type PasswordLoginFieldComponentSet = Readonly<{
            loginIDField: LoginIDFieldComponent
            passwordField: PasswordFieldComponent
        }>

        class PasswordLoginWorker {
            componentID: IDGenerator

            fields: Record<number, PasswordLoginFieldComponentSet> = []
            post: Record<number, Post<PasswordLoginState>[]> = []

            constructor() {
                this.componentID = new IDGenerator()
            }

            init(fields: PasswordLoginFieldComponentSet): PasswordLoginComponent {
                const componentID = this.componentID.generate()

                const listener: Post<PasswordLoginState>[] = []

                this.fields[componentID] = fields
                this.post[componentID] = listener

                const param = {
                    pagePathname: currentPagePathname(currentLocation),
                }
                post({ type: "passwordLogin-init", componentID, param })

                return {
                    action: (request: PasswordLoginRequest) => {
                        post({ type: "passwordLogin-action", componentID, request })
                    },
                    onStateChange(post: Post<PasswordLoginState>) {
                        listener.push(post)
                    },
                }
            }
            resolve({ componentID, state }: { componentID: number, state: PasswordLoginState }): void {
                if (this.post[componentID]) {
                    this.post[componentID].forEach(post => post(state))
                }
            }
            validateLoginID({ componentID, requestID }: { componentID: number, requestID: number }): void {
                if (this.fields[componentID]) {
                    this.fields[componentID].loginIDField.validate((event) => {
                        post({ type: "loginIDField-content", componentID, requestID, content: event.content })
                    })
                }
            }
            validatePassword({ componentID, requestID }: { componentID: number, requestID: number }): void {
                if (this.fields[componentID]) {
                    this.fields[componentID].passwordField.validate((event) => {
                        post({ type: "passwordField-content", componentID, requestID, content: event.content })
                    })
                }
            }
        }

        const passwordLoginWorker = new PasswordLoginWorker()

        this.worker.addEventListener("message", (event: MessageEvent<WorkerEvent>) => {
            const data = event.data
            switch (data.type) {
                case "credential-store-init":
                    map.credential.store[data.actionID] = factory.credential.store()
                    break

                case "credential-store-action":
                    if (map.credential.store[data.actionID]) {
                        map.credential.store[data.actionID](data.authCredential, (event) => {
                            post({ type: "credential-store-post", actionID: data.actionID, requestID: data.requestID, event })
                        })
                    } else {
                        this.post({ type: "error", err: "action has not been initialized" })
                    }
                    break

                case "passwordLogin-post":
                    passwordLoginWorker.resolve(data)
                    break

                case "loginIDField-validate":
                    passwordLoginWorker.validateLoginID(data)
                    break

                case "passwordField-validate":
                    passwordLoginWorker.validatePassword(data)
                    break
            }
        })

        // TODO たぶん components を main で初期化するんだと思う
        this.components = {
            renewCredential: () => initRenewCredential(factory, init, currentLocation, (renewCredential) => {
                this.hookCredentialStateChange(currentLocation, renewCredential)
            }),

            passwordLogin: () => {
                const fields = {
                    loginIDField: init.field.loginID({ loginID: factory.field.loginID() }),
                    passwordField: init.field.password({ password: factory.field.password() }),
                }
                return {
                    href: init.href(),
                    passwordLogin: passwordLoginWorker.init(fields),
                    ...fields,
                }
            },
            passwordResetSession: () => {
                const fields = {
                    loginIDField: init.field.loginID({ loginID: factory.field.loginID() }),
                }
                return initPasswordResetSession(factory, init, fields)
            },
            passwordReset: () => {
                const fields = {
                    loginIDField: init.field.loginID({ loginID: factory.field.loginID() }),
                    passwordField: init.field.password({ password: factory.field.password() }),
                }
                return initPasswordReset(factory, init, currentLocation, fields)
            },
        }
    }

    hookCredentialStateChange(currentLocation: Location, renewCredential: RenewCredentialComponent): void {
        renewCredential.onStateChange((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.post(detectLoginState(currentLocation))
                    return
            }
        })
    }

    onStateChange(post: Post<AuthState>): void {
        this.listener.push(post)
    }
    post(state: AuthState): void {
        this.listener.forEach(post => post(state))
    }

    terminate(): void {
        this.worker.terminate()
    }
    load() {
        this.post({ type: "renew-credential" })
    }
}

function initRenewCredential(factory: FactorySet, init: InitSet, currentLocation: Location, hook: Hook<RenewCredentialComponent>) {
    const actions = {
        renew: factory.credential.renew(),
        setContinuousRenew: factory.credential.setContinuousRenew(),
        secureScriptPath: factory.application.secureScriptPath(),
    }

    const param = {
        pagePathname: currentPagePathname(currentLocation),
    }

    const renewCredential = init.renewCredential(actions, param)
    hook(renewCredential)

    return {
        renewCredential,
    }
}
/*
function initPasswordLogin(factory: Factory, init: Init, currentLocation: Location) {
    const loginID = factory.field.loginID()
    const password = factory.field.password()

    const actions = {
        login: factory.passwordLogin.login(),
        field: {
            loginID: loginID.action,
            password: password.action,
        },
        store: factory.credential.store(),
        path: factory.application.path(),
    }

    const fields = {
        loginIDField: init.field.loginID({ loginID }),
        passwordField: init.field.password({ password }),
    }

    const param = {
        pagePathname: currentPagePathname(currentLocation),
    }

    return {
        href: init.href(),
        passwordLogin: init.passwordLogin(actions, fields, param),
    }
}
 */
interface PasswordLoginComponentListener {
    onStateChange(state: PasswordLoginState): void
}
function initPasswordLoginComponent(storeFactory: Factory<StoreAction>, factory: WorkerFactory, init: WorkerInit, param: PasswordLoginParam, listener: PasswordLoginComponentListener, fields: LoginFieldCollector) {
    const actions = {
        login: factory.passwordLogin.login(fields),
        store: storeFactory(),
        secureScriptPath: factory.application.secureScriptPath(),
    }

    const component = init.passwordLogin(actions, param)

    component.onStateChange(state => listener.onStateChange(state))

    return component
}
function initPasswordResetSession(factory: FactorySet, init: InitSet, components: { loginIDField: LoginIDFieldComponent }) {
    const fields = {
        loginID(): Promise<Content<LoginID>> {
            return new Promise((resolve) => {
                components.loginIDField.validate((event) => {
                    resolve(event.content)
                })
            })
        },
    }
    const actions = {
        startSession: factory.passwordReset.startSession(fields),
        pollingStatus: factory.passwordReset.pollingStatus(),
    }

    return {
        href: init.href(),
        passwordResetSession: init.passwordResetSession(actions),
        loginIDField: init.field.loginID({ loginID: factory.field.loginID() }),
    }
}
function initPasswordReset(factory: FactorySet, init: InitSet, currentLocation: Location, components: { loginIDField: LoginIDFieldComponent, passwordField: PasswordFieldComponent }) {
    const fields = {
        loginID(): Promise<Content<LoginID>> {
            return new Promise((resolve) => {
                components.loginIDField.validate((event) => {
                    resolve(event.content)
                })
            })
        },
        password(): Promise<Content<Password>> {
            return new Promise((resolve) => {
                components.passwordField.validate((event) => {
                    resolve(event.content)
                })
            })
        }
    }
    const actions = {
        reset: factory.passwordReset.reset(fields),
        store: factory.credential.store(),
        secureScriptPath: factory.application.secureScriptPath(),
    }

    const param = {
        pagePathname: currentPagePathname(currentLocation),
        resetToken: detectPasswordResetToken(currentLocation),
    }

    return {
        href: init.href(),
        passwordReset: init.passwordReset(actions, param),
        loginIDField: init.field.loginID({ loginID: factory.field.loginID() }),
        passwordField: init.field.password({ password: factory.field.password() }),
    }
}

function currentPagePathname(currentLocation: Location) {
    return packPagePathname(new URL(currentLocation.toString()))
}

interface Hook<T> {
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
