import {
    PasswordLoginComponentAction,
    PasswordLoginComponent,
    PasswordLoginState,
    PasswordLoginComponentOperation,
    PasswordLoginWorkerState,
    PasswordLoginWorkerComponentHelper,
} from "../password_login/component"

import { LoginIDFieldState } from "../field/login_id/component"
import { PasswordFieldState } from "../field/password/component"

import { LoginIDField } from "../../../field/login_id/action"
import { PasswordField } from "../../../field/password/action"

import { LoginID } from "../../../login_id/data"
import { Password } from "../../../password/data"
import { LoginEvent } from "../../../password_login/data"
import { LoginIDFieldEvent } from "../../../field/login_id/data"
import { PasswordFieldEvent } from "../../../field/password/data"
import { Content } from "../../../field/data"

export function initPasswordLoginComponent(action: PasswordLoginComponentAction): PasswordLoginComponent {
    return new Component(action)
}
export function initPasswordLoginWorkerComponent(init: WorkerInit): PasswordLoginComponent {
    return new WorkerComponent(init)
}
export function initPasswordLoginWorkerComponentHelper(): PasswordLoginWorkerComponentHelper {
    return {
        mapPasswordLoginState,
        mapLoginIDFieldState,
        mapPasswordFieldState,
    }
}

class Component implements PasswordLoginComponent {
    action: PasswordLoginComponentAction

    listener: Post<PasswordLoginState>[]

    field: {
        loginID: LoginIDField
        password: PasswordField
    }

    content: {
        loginID: Content<LoginID>
        password: Content<Password>
    }

    constructor(action: PasswordLoginComponentAction) {
        this.action = action
        this.action.passwordLogin.sub.onLoginEvent((event) => {
            const state = mapEvent(event)
            this.listener.forEach(post => post(state))
        })

        this.listener = []

        this.field = {
            loginID: this.action.loginIDField.initLoginIDField(),
            password: this.action.passwordField.initPasswordField(),
        }

        this.content = {
            loginID: { valid: false },
            password: { valid: false },
        }

        this.field.loginID.sub.onLoginIDFieldEvent((event: LoginIDFieldEvent) => {
            this.content.loginID = event.content
        })
        this.field.password.sub.onPasswordFieldEvent((event: PasswordFieldEvent) => {
            this.content.password = event.content
        })
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

    init(): Terminate {
        return () => this.terminate()
    }
    terminate(): void {
        // WorkerComponent とインターフェイスを合わせるために必要
    }

    trigger(operation: PasswordLoginComponentOperation): Promise<void> {
        switch (operation.type) {
            case "login":
                return this.login()

            case "field-login_id":
                return Promise.resolve(this.field.loginID.trigger(operation.operation))

            case "field-password":
                return Promise.resolve(this.field.password.trigger(operation.operation))
        }
    }

    login(): Promise<void> {
        this.field.loginID.validate()
        this.field.password.validate()

        return this.action.passwordLogin.login([
            this.content.loginID,
            this.content.password,
        ])
    }
}

class WorkerComponent implements PasswordLoginComponent {
    worker: WorkerHolder

    listener: {
        passwordLogin: Post<PasswordLoginState>[]
        loginID: Post<LoginIDFieldState>[]
        password: Post<PasswordFieldState>[]
    }

    constructor(init: WorkerInit) {
        this.worker = { set: false, init }
        this.listener = {
            passwordLogin: [],
            loginID: [],
            password: [],
        }
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

    init(): Terminate {
        this.initComponent()
        return () => this.terminate()
    }
    initComponent(): void {
        if (!this.worker.set) {
            const instance = this.worker.init()

            instance.addEventListener("message", (event) => {
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

                    default:
                        assertNever(state)
                }
            })

            this.worker = { set: true, instance }
        }
    }
    terminate(): void {
        if (this.worker.set) {
            this.worker.instance.terminate()
        }
    }

    async trigger(operation: PasswordLoginComponentOperation): Promise<void> {
        if (this.worker.set) {
            this.worker.instance.postMessage(operation)
        }
    }
}

function mapEvent(event: LoginEvent): PasswordLoginState {
    return event
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

interface Post<T> {
    (state: T): void
}

type WorkerHolder =
    Readonly<{ set: false, init: WorkerInit }> |
    Readonly<{ set: true, instance: Worker }>

interface WorkerInit {
    (): Worker
}

interface Terminate {
    (): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
