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

import { LoginIDFieldInit, LoginIDFieldState, LoginIDFieldRequest } from "../component/field/login_id/component"
import { PasswordFieldInit, PasswordFieldState, PasswordFieldRequest } from "../component/field/password/component"

import { PathFactory } from "../../application/action"
import { RenewFactory, StoreFactory, StoreAction } from "../../credential/action"

import { LoginFactory } from "../../password_login/action"
import { SessionFactory, ResetFactory } from "../../password_reset/action"

import { LoginIDFieldFactory } from "../../login_id/field/action"
import { PasswordFieldFactory } from "../../password/field/action"

import { AuthCredential, StoreEvent } from "../../credential/data"
import { ResetToken } from "../../password_reset/data"

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

type Factory = Readonly<{
    application: {
        path: PathFactory
    }
    credential: {
        renew: RenewFactory
        store: StoreFactory
    }

    passwordLogin: {
        login: LoginFactory
    }
    passwordReset: {
        session: SessionFactory
        reset: ResetFactory
    }

    field: {
        loginID: LoginIDFieldFactory
        password: PasswordFieldFactory
    }
}>

type Init = Readonly<{
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
        path: PathFactory
    }

    passwordLogin: {
        login: LoginFactory
    }
    passwordReset: {
        session: SessionFactory
        reset: ResetFactory
    }

    field: {
        loginID: LoginIDFieldFactory
        password: PasswordFieldFactory
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

export function initAuthInit(factory: Factory, init: Init): AuthInit {
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

    const storeFactory: StoreFactory = () => {
        const id = actionID.generate()
        post({ type: "credential-store-init", actionID: id })

        return {
            action: (authCredential: AuthCredential) => {
                post({ type: "credential-store-action", actionID: id, authCredential })
            },
            subscriber: {
                onStoreEvent(post: Post<StoreEvent>) {
                    worker.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
                        switch (event.data.type) {
                            case "credential-store-post":
                                if (event.data.actionID === id) {
                                    post(event.data.event)
                                }
                                break
                        }
                    })
                },
            },
        }
    }

    worker.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
        const data = event.data
        switch (data.type) {
            case "passwordLogin-init":
                map.passwordLogin[data.componentID] = initPasswordLoginComponent(storeFactory, factory, init, data.param, {
                    onStateChange(state) {
                        post({ type: "passwordLogin-post", componentID: data.componentID, state })
                    },
                    onLoginIDFieldStateChange(state) {
                        post({ type: "passwordLogin-loginIDField-post", componentID: data.componentID, state })
                    },
                    onPasswordFieldStateChange(state) {
                        post({ type: "passwordLogin-passwordField-post", componentID: data.componentID, state })
                    },
                })
                break

            case "passwordLogin-action":
                if (map.passwordLogin[data.componentID]) {
                    map.passwordLogin[data.componentID].action(data.request)
                } else {
                    post({ type: "error", err: "component has not been initialized" })
                }
                break

            case "passwordLogin-loginIDField-action":
                if (map.passwordLogin[data.componentID]) {
                    map.passwordLogin[data.componentID].components.loginIDField.action(data.request)
                } else {
                    post({ type: "error", err: "component has not been initialized" })
                }
                break

            case "passwordLogin-passwordField-action":
                if (map.passwordLogin[data.componentID]) {
                    map.passwordLogin[data.componentID].components.passwordField.action(data.request)
                } else {
                    post({ type: "error", err: "component has not been initialized" })
                }
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
    Readonly<{ type: "passwordLogin-loginIDField-action", componentID: number, request: LoginIDFieldRequest }> |
    Readonly<{ type: "passwordLogin-passwordField-action", componentID: number, request: PasswordFieldRequest }> |
    Readonly<{ type: "credential-store-post", actionID: number, event: StoreEvent }> |
    Readonly<{ type: "error", err: string }>

type WorkerEvent =
    Readonly<{ type: "credential-store-init", actionID: number }> |
    Readonly<{ type: "credential-store-action", actionID: number, authCredential: AuthCredential }> |
    Readonly<{ type: "passwordLogin-post", componentID: number, state: PasswordLoginState }> |
    Readonly<{ type: "passwordLogin-loginIDField-post", componentID: number, state: LoginIDFieldState }> |
    Readonly<{ type: "passwordLogin-passwordField-post", componentID: number, state: PasswordFieldState }> |
    Readonly<{ type: "error", err: string }>

class View implements AuthView {
    listener: Post<AuthState>[] = []

    components: AuthComponentSet

    constructor(factory: Factory, init: Init, currentLocation: Location) {
        const componentID = new IDGenerator()
        const map: ActionMap = {
            credential: {
                store: [],
            },
        }

        const worker = new Worker("./auth.worker.js")
        const post: Post<WorkerRequest> = (request) => worker.postMessage(request)

        const passwordLoginInit = (): PasswordLoginComponent => {
            const id = componentID.generate()
            const param = {
                pagePathname: currentPagePathname(currentLocation),
            }
            post({ type: "passwordLogin-init", componentID: id, param })

            return {
                action: (request: PasswordLoginRequest) => {
                    post({ type: "passwordLogin-action", componentID: id, request })
                },
                onStateChange(post: Post<PasswordLoginState>) {
                    worker.addEventListener("message", (event: MessageEvent<WorkerEvent>) => {
                        switch (event.data.type) {
                            case "passwordLogin-post":
                                if (event.data.componentID === id) {
                                    post(event.data.state)
                                }
                                break
                        }
                    })
                },
                components: {
                    loginIDField: {
                        action: (request: LoginIDFieldRequest) => {
                            post({ type: "passwordLogin-loginIDField-action", componentID: id, request })
                        },
                        onStateChange(post: Post<LoginIDFieldState>) {
                            worker.addEventListener("message", (event: MessageEvent<WorkerEvent>) => {
                                switch (event.data.type) {
                                    case "passwordLogin-loginIDField-post":
                                        if (event.data.componentID === id) {
                                            post(event.data.state)
                                        }
                                        break
                                }
                            })
                        },
                    },
                    passwordField: {
                        action: (request: PasswordFieldRequest) => {
                            post({ type: "passwordLogin-passwordField-action", componentID: id, request })
                        },
                        onStateChange(post: Post<PasswordFieldState>) {
                            worker.addEventListener("message", (event: MessageEvent<WorkerEvent>) => {
                                switch (event.data.type) {
                                    case "passwordLogin-passwordField-post":
                                        if (event.data.componentID === id) {
                                            post(event.data.state)
                                        }
                                        break
                                }
                            })
                        },
                    },
                },
            }
        }

        worker.addEventListener("message", (event: MessageEvent<WorkerEvent>) => {
            const data = event.data
            switch (data.type) {
                case "credential-store-init":
                    map.credential.store[data.actionID] = initStoreAction(factory, {
                        onStoreEvent(event) {
                            post({ type: "credential-store-post", actionID: data.actionID, event })
                        },
                    })
                    break

                case "credential-store-action":
                    if (map.credential.store[data.actionID]) {
                        map.credential.store[data.actionID](data.authCredential)
                    } else {
                        post({ type: "error", err: "action has not been initialized" })
                    }
                    break
            }
        })

        // TODO たぶん components を main で初期化するんだと思う
        this.components = {
            renewCredential: () => initRenewCredential(factory, init, currentLocation, (renewCredential) => {
                this.hookCredentialStateChange(currentLocation, renewCredential)
            }),

            passwordLogin: () => {
                return {
                    href: init.href(),
                    passwordLogin: passwordLoginInit(),
                }
            },
            passwordResetSession: () => initPasswordResetSession(factory, init),
            passwordReset: () => initPasswordReset(factory, init, currentLocation),
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
        // worker とインターフェイスを合わせるために必要
    }
    load() {
        this.post({ type: "renew-credential" })
    }
}

function initRenewCredential(factory: Factory, init: Init, currentLocation: Location, hook: Hook<RenewCredentialComponent>) {
    const actions = {
        renew: factory.credential.renew(),
        path: factory.application.path(),
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
interface StoreActionListener {
    onStoreEvent(event: StoreEvent): void
}
function initStoreAction(factory: Factory, listener: StoreActionListener) {
    const { action, subscriber } = factory.credential.store()
    subscriber.onStoreEvent(event => listener.onStoreEvent(event))
    return action
}
interface PasswordLoginComponentListener {
    onStateChange(state: PasswordLoginState): void
    onLoginIDFieldStateChange(state: LoginIDFieldState): void
    onPasswordFieldStateChange(state: PasswordFieldState): void
}
function initPasswordLoginComponent(storeFactory: StoreFactory, factory: WorkerFactory, init: WorkerInit, param: PasswordLoginParam, listener: PasswordLoginComponentListener) {
    const loginID = factory.field.loginID()
    const password = factory.field.password()

    const actions = {
        login: factory.passwordLogin.login(),
        field: {
            loginID: loginID.action,
            password: password.action,
        },
        store: storeFactory(),
        path: factory.application.path(),
    }

    const fields = {
        loginIDField: init.field.loginID({ loginID }),
        passwordField: init.field.password({ password }),
    }

    const component = init.passwordLogin(actions, fields, param)

    component.onStateChange(state => listener.onStateChange(state))
    component.components.loginIDField.onStateChange(state => listener.onLoginIDFieldStateChange(state))
    component.components.passwordField.onStateChange(state => listener.onPasswordFieldStateChange(state))

    return component
}
function initPasswordResetSession(factory: Factory, init: Init) {
    const loginID = factory.field.loginID()

    const actions = {
        session: factory.passwordReset.session(),
        field: {
            loginID: loginID.action,
        },
    }

    const fields = {
        loginIDField: init.field.loginID({ loginID }),
    }

    return {
        href: init.href(),
        passwordResetSession: init.passwordResetSession(actions, fields),
    }
}
function initPasswordReset(factory: Factory, init: Init, currentLocation: Location) {
    const loginID = factory.field.loginID()
    const password = factory.field.password()

    const actions = {
        reset: factory.passwordReset.reset(),
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
        resetToken: detectPasswordResetToken(currentLocation),
    }

    return {
        href: init.href(),
        passwordReset: init.passwordReset(actions, fields, param),
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
interface Terminate {
    (): void
}
