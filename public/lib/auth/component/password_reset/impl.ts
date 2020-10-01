import { AuthBackground } from "../../usecase"

import { BackgroundCredentialOperation } from "../../../background/credential/component"

import {
    PasswordResetComponent,
    PasswordResetComponentResource,
    PasswordResetParam,
    PasswordResetState,
    PasswordResetOperation,
    PasswordResetWorkerState,
    PasswordResetWorkerComponentHelper,
} from "../password_reset/component"

import { LoginIDFieldState } from "../field/login_id/component"
import { PasswordFieldState } from "../field/password/component"

import { PasswordResetAction } from "../../../password_reset/action"
import { LoginIDFieldAction } from "../../../login_id/field/action"
import { PasswordFieldAction } from "../../../password/field/action"

import { LoginIDField } from "../../../login_id/field/action"
import { PasswordField } from "../../../password/field/action"

import { LoginID } from "../../../login_id/data"
import { Password } from "../../../password/data"
import { ResetToken, ResetEvent } from "../../../password_reset/data"
import { LoginIDFieldEvent } from "../../../login_id/field/data"
import { PasswordFieldEvent } from "../../../password/field/data"
import { Content, invalidContent } from "../../../field/data"

export interface Action {
    passwordReset: PasswordResetAction
    loginIDField: LoginIDFieldAction
    passwordField: PasswordFieldAction
}

export function initPasswordResetComponent(background: AuthBackground, action: Action): PasswordResetComponent {
    return new Component(background, action)
}
export function initPasswordResetWorkerComponent(background: AuthBackground, initializer: WorkerInitializer): PasswordResetComponent {
    return new WorkerComponent(background, initializer)
}
export function initPasswordResetWorkerComponentHelper(): PasswordResetWorkerComponentHelper {
    return {
        mapBackgroundCredentialOperation,
        mapPasswordResetState,
        mapLoginIDFieldState,
        mapPasswordFieldState,
    }
}

export function packPasswordResetParam(resetToken: ResetToken): PasswordResetParam {
    return { resetToken } as PasswordResetParam & Param
}

function unpackPasswordResetParam(param: PasswordResetParam): Param {
    return param as unknown as Param
}

type Param = {
    resetToken: ResetToken
}

class Component implements PasswordResetComponent {
    background: AuthBackground
    action: Action

    field: {
        loginID: LoginIDField
        password: PasswordField
    }

    listener: Post<PasswordResetState>[] = []

    holder: ParamHolder<Param> = { set: false }

    content: {
        loginID: Content<LoginID>
        password: Content<Password>
    } = {
            loginID: invalidContent(),
            password: invalidContent(),
        }

    constructor(background: AuthBackground, action: Action) {
        this.background = background
        this.action = action
        this.action.passwordReset.sub.onResetEvent((event) => {
            this.post(this.mapResetEvent(event))
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
    post(state: PasswordResetState): void {
        this.listener.forEach(post => post(state))
    }
    mapResetEvent(event: ResetEvent): PasswordResetState {
        if (event.type === "succeed-to-reset") {
            this.background.credential({ type: "store", authCredential: event.authCredential })
        }
        return event
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

    init(): PasswordResetComponentResource {
        return {
            request: operation => this.request(operation),
            terminate: () => { /* WorkerComponent とインターフェイスを合わせるために必要 */ },
        }
    }
    request(operation: PasswordResetOperation): void {
        switch (operation.type) {
            case "set-param":
                this.holder = { set: true, param: unpackPasswordResetParam(operation.param) }
                return

            case "reset":
                return this.reset()

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

    reset(): void {
        this.field.loginID.validate()
        this.field.password.validate()

        if (this.holder.set) {
            this.action.passwordReset.reset(this.holder.param.resetToken, this.content)
        } else {
            this.post({ type: "error", err: "param is not initialized" })
        }
    }
}

class WorkerComponent implements PasswordResetComponent {
    background: AuthBackground
    initializer: WorkerInitializer

    listener: {
        passwordReset: Post<PasswordResetState>[]
        loginID: Post<LoginIDFieldState>[]
        password: Post<PasswordFieldState>[]
    } = {
            passwordReset: [],
            loginID: [],
            password: [],
        }

    constructor(background: AuthBackground, initializer: WorkerInitializer) {
        this.background = background
        this.initializer = initializer
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

    init(): PasswordResetComponentResource {
        const worker = this.initWorker()
        return {
            request: operation => worker.postMessage(operation),
            terminate: () => worker.terminate(),
        }
    }
    initWorker(): Worker {
        const worker = this.initializer()

        worker.addEventListener("message", (event) => {
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

function mapBackgroundCredentialOperation(operation: BackgroundCredentialOperation): PasswordResetWorkerState {
    return { type: "background-credential", operation }
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

interface WorkerInitializer {
    (): Worker
}

type ParamHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, param: Readonly<T> }>

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
