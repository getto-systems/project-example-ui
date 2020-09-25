import {
    PasswordResetComponentAction,
    PasswordResetComponent,
    PasswordResetState,
    PasswordResetComponentOperation,
    PasswordResetWorkerState,
    PasswordResetWorkerComponentHelper,
} from "../password_reset/component"

import { LoginIDFieldState } from "../field/login_id/component"
import { PasswordFieldState } from "../field/password/component"

import { LoginIDField } from "../../../field/login_id/action"
import { PasswordField } from "../../../field/password/action"

import { LoginID } from "../../../login_id/data"
import { Password } from "../../../password/data"
import { ResetToken, ResetEvent } from "../../../password_reset/data"
import { LoginIDFieldEvent } from "../../../field/login_id/data"
import { PasswordFieldEvent } from "../../../field/password/data"
import { Content } from "../../../field/data"

export function initPasswordResetComponent(action: PasswordResetComponentAction): PasswordResetComponent {
    return new Component(action)
}
export function initPasswordResetWorkerComponent(init: WorkerInit): PasswordResetComponent {
    return new WorkerComponent(init)
}
export function initPasswordResetWorkerComponentHelper(): PasswordResetWorkerComponentHelper {
    return {
        mapPasswordResetState,
        mapLoginIDFieldState,
        mapPasswordFieldState,
    }
}

class Component implements PasswordResetComponent {
    action: PasswordResetComponentAction

    listener: Post<PasswordResetState>[]

    field: {
        loginID: LoginIDField
        password: PasswordField
    }

    content: {
        loginID: Content<LoginID>
        password: Content<Password>
    }

    constructor(action: PasswordResetComponentAction) {
        this.action = action
        this.action.passwordReset.sub.onResetEvent((event) => {
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

    onStateChange(stateChanged: Post<PasswordResetState>): void {
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
    trigger(operation: PasswordResetComponentOperation): Promise<void> {
        switch (operation.type) {
            case "reset":
                return this.reset(operation.resetToken)

            case "field-login_id":
                return Promise.resolve(this.field.loginID.trigger(operation.operation))

            case "field-password":
                return Promise.resolve(this.field.password.trigger(operation.operation))
        }
    }

    async reset(resetToken: ResetToken): Promise<void> {
        this.field.loginID.validate()
        this.field.password.validate()

        return this.action.passwordReset.reset(resetToken, [
            this.content.loginID,
            this.content.password,
        ])
    }
}

class WorkerComponent implements PasswordResetComponent {
    worker: WorkerHolder

    listener: {
        passwordReset: Post<PasswordResetState>[]
        loginID: Post<LoginIDFieldState>[]
        password: Post<PasswordFieldState>[]
    }

    constructor(init: WorkerInit) {
        this.worker = { set: false, init }
        this.listener = {
            passwordReset: [],
            loginID: [],
            password: [],
        }
    }

    onStateChange(stateChanged: Post<PasswordResetState>): void {
        this.listener.passwordReset.push(stateChanged)
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
                const state = event.data as PasswordResetWorkerState
                switch (state.type) {
                    case "password_reset":
                        this.listener.passwordReset.forEach(post => post(state.state))
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

    async trigger(operation: PasswordResetComponentOperation): Promise<void> {
        if (this.worker.set) {
            this.worker.instance.postMessage(operation)
        }
    }
}

function mapEvent(event: ResetEvent): PasswordResetState {
    return event
}

function mapPasswordResetState(state: PasswordResetState): PasswordResetWorkerState {
    return { type: "password_reset", state }
}
function mapLoginIDFieldState(state: LoginIDFieldState): PasswordResetWorkerState {
    return { type: "field-login_id", state }
}
function mapPasswordFieldState(state: PasswordFieldState): PasswordResetWorkerState {
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
