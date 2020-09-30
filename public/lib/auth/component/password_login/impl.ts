import { AuthBackground } from "../../usecase"

import { BackgroundCredentialOperation } from "../../../background/credential/component"

import {
    PasswordLoginComponent,
    PasswordLoginComponentResource,
    PasswordLoginState,
    PasswordLoginOperation,
    PasswordLoginWorkerState,
    PasswordLoginWorkerComponentHelper,
} from "../password_login/component"

import { LoginIDFieldState } from "../field/login_id/component"
import { PasswordFieldState } from "../field/password/component"

import { PasswordLoginAction } from "../../../password_login/action"
import { LoginIDFieldAction } from "../../../field/login_id/action"
import { PasswordFieldAction } from "../../../field/password/action"

import { LoginIDField } from "../../../field/login_id/action"
import { PasswordField } from "../../../field/password/action"

import { LoginID } from "../../../login_id/data"
import { Password } from "../../../password/data"
import { LoginEvent } from "../../../password_login/data"
import { LoginIDFieldEvent } from "../../../field/login_id/data"
import { PasswordFieldEvent } from "../../../field/password/data"
import { Content } from "../../../field/data"

type Action = Readonly<{
    passwordLogin: PasswordLoginAction
    loginIDField: LoginIDFieldAction
    passwordField: PasswordFieldAction
}>

export function initPasswordLoginComponent(background: AuthBackground, action: Action): PasswordLoginComponent {
    return new Component(background, action)
}
export function initPasswordLoginWorkerComponent(background: AuthBackground, initializer: WorkerInitializer): PasswordLoginComponent {
    return new WorkerComponent(background, initializer)
}
export function initPasswordLoginWorkerComponentHelper(): PasswordLoginWorkerComponentHelper {
    return {
        mapBackgroundCredentialOperation,
        mapPasswordLoginState,
        mapLoginIDFieldState,
        mapPasswordFieldState,
    }
}

class Component implements PasswordLoginComponent {
    background: AuthBackground
    action: Action

    listener: Post<PasswordLoginState>[] = []

    field: {
        loginID: LoginIDField
        password: PasswordField
    }

    content: {
        loginID: Content<LoginID>
        password: Content<Password>
    } = {
            loginID: { valid: false },
            password: { valid: false },
        }

    constructor(background: AuthBackground, action: Action) {
        this.background = background

        this.action = action
        this.action.passwordLogin.sub.onLoginEvent((event) => {
            this.post(this.mapEvent(event))
        })

        this.field = {
            loginID: this.action.loginIDField.initLoginIDField(),
            password: this.action.passwordField.initPasswordField(),
        }

        this.field.loginID.sub.onLoginIDFieldEvent((event: LoginIDFieldEvent) => {
            this.content.loginID = event.content
        })
        this.field.password.sub.onPasswordFieldEvent((event: PasswordFieldEvent) => {
            this.content.password = event.content
        })
    }
    post(state: PasswordLoginState): void {
        this.listener.forEach(post => post(state))
    }
    mapEvent(event: LoginEvent): PasswordLoginState {
        if (event.type === "succeed-to-login") {
            this.background.credential({ type: "store", authCredential: event.authCredential })
        }
        return event
    }

    onStateChange(stateChanged: Post<PasswordLoginState>): void {
        this.listener.push(stateChanged)
    }
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void {
        this.field.loginID.sub.onLoginIDFieldEvent(stateChanged)
    }
    onPasswordFieldStateChange(stateChanged: Post<PasswordFieldState>): void {
        this.field.password.sub.onPasswordFieldEvent(stateChanged)
    }

    init(): PasswordLoginComponentResource {
        return {
            request: operation => this.request(operation),
            terminate: () => { /* WorkerComponent とインターフェイスを合わせるために必要 */ },
        }
    }
    request(operation: PasswordLoginOperation): void {
        switch (operation.type) {
            case "login":
                this.field.loginID.validate()
                this.field.password.validate()
                this.action.passwordLogin.login(this.content)
                return

            case "field-login_id":
                this.field.loginID.trigger(operation.operation)
                return

            case "field-password":
                this.field.password.trigger(operation.operation)
                return

            default:
                assertNever(operation)
        }
    }
}

class WorkerComponent implements PasswordLoginComponent {
    background: AuthBackground
    initializer: WorkerInitializer

    listener: {
        passwordLogin: Post<PasswordLoginState>[]
        loginID: Post<LoginIDFieldState>[]
        password: Post<PasswordFieldState>[]
    } = {
            passwordLogin: [],
            loginID: [],
            password: [],
        }

    constructor(background: AuthBackground, initializer: WorkerInitializer) {
        this.background = background
        this.initializer = initializer
    }

    onStateChange(stateChanged: Post<PasswordLoginState>): void {
        this.listener.passwordLogin.push(stateChanged)
    }
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void {
        this.listener.loginID.push(stateChanged)
    }
    onPasswordFieldStateChange(stateChanged: Post<PasswordFieldState>): void {
        this.listener.password.push(stateChanged)
    }

    init(): PasswordLoginComponentResource {
        const worker = this.initWorker()
        return {
            request: operation => worker.postMessage(operation),
            terminate: () => worker.terminate(),
        }
    }
    initWorker(): Worker {
        const worker = this.initializer()

        worker.addEventListener("message", (event) => {
            const state = event.data as PasswordLoginWorkerState
            switch (state.type) {
                case "password_login":
                    this.listener.passwordLogin.forEach(post => post(state.state))
                    return

                case "field-login_id":
                    this.listener.loginID.forEach(post => post(state.state))
                    return

                case "field-password":
                    this.listener.password.forEach(post => post(state.state))
                    return

                case "background-credential":
                    this.background.credential(state.operation)
                    return

                default:
                    assertNever(state)
            }
        })

        return worker
    }
}

function mapBackgroundCredentialOperation(operation: BackgroundCredentialOperation): PasswordLoginWorkerState {
    return { type: "background-credential", operation }
}
function mapPasswordLoginState(state: PasswordLoginState): PasswordLoginWorkerState {
    return { type: "password_login", state }
}
function mapLoginIDFieldState(state: LoginIDFieldState): PasswordLoginWorkerState {
    return { type: "field-login_id", state }
}
function mapPasswordFieldState(state: PasswordFieldState): PasswordLoginWorkerState {
    return { type: "field-password", state }
}

interface WorkerInitializer {
    (): Worker
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
