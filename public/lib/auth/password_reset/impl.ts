import { PasswordResetComponentAction, PasswordResetComponent, PasswordResetWorkerComponentHelper } from "./component"

import { PasswordResetState, PasswordResetComponentOperation, PasswordResetWorkerState } from "./data"

import { LoginIDFieldState } from "../field/login_id/data"
import { PasswordFieldState } from "../field/password/data"

import { LoginIDField } from "../../field/login_id/action"
import { PasswordField } from "../../field/password/action"

import { LoginID } from "../../login_id/data"
import { Password } from "../../password/data"
import { ResetToken, ResetEvent } from "../../password_reset/data"
import { LoginIDFieldEvent } from "../../field/login_id/data"
import { PasswordFieldEvent } from "../../field/password/data"
import { Content } from "../../field/data"

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

    listener: Publisher<PasswordResetState>[]

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

    hook(pub: Publisher<PasswordResetState>): void {
        this.listener.push(pub)
    }
    onStateChange(stateChanged: Publisher<PasswordResetState>): void {
        this.action.passwordReset.sub.onResetEvent((event) => {
            const state = map(event)
            this.listener.forEach(pub => pub(state))
            stateChanged(state)

            function map(event: ResetEvent): PasswordResetState {
                return event
            }
        })
    }
    onLoginIDFieldStateChange(stateChanged: Publisher<LoginIDFieldState>): void {
        this.field.loginID.sub.onLoginIDFieldEvent(stateChanged)
    }
    onPasswordFieldStateChange(stateChanged: Publisher<PasswordFieldState>): void {
        this.field.password.sub.onPasswordFieldEvent(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
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
    listener: Publisher<PasswordResetState>[]

    constructor(init: WorkerInit) {
        this.worker = { set: false, stack: [], init }
        this.listener = []
    }

    hook(pub: Publisher<PasswordResetState>): void {
        this.listener.push(pub)
    }
    onStateChange(stateChanged: Publisher<PasswordResetState>): void {
        if (!this.worker.set) {
            const instance = this.initWorker(this.worker.init, this.worker.stack, (state) => {
                this.listener.forEach(pub => pub(state))
                stateChanged(state)
            })
            this.worker = { set: true, instance }
        }
    }
    initWorker(init: WorkerInit, stack: WorkerSetup[], stateChanged: Publisher<PasswordResetState>): Worker {
        const worker = init()
        worker.addEventListener("message", (event) => {
            const state = event.data as PasswordResetWorkerState
            if (state.type === "password_reset") {
                stateChanged(state.state)
            }
        })
        stack.forEach((setup) => {
            setup(worker)
        })
        return worker
    }

    onLoginIDFieldStateChange(stateChanged: Publisher<LoginIDFieldState>): void {
        if (this.worker.set) {
            setup(this.worker.instance)
        } else {
            this.worker.stack.push(setup)
        }

        function setup(worker: Worker): void {
            worker.addEventListener("message", (event) => {
                const state = event.data as PasswordResetWorkerState
                if (state.type === "field-login_id") {
                    stateChanged(state.state)
                }
            })
        }
    }
    onPasswordFieldStateChange(stateChanged: Publisher<PasswordFieldState>): void {
        if (this.worker.set) {
            setup(this.worker.instance)
        } else {
            this.worker.stack.push(setup)
        }

        function setup(worker: Worker): void {
            worker.addEventListener("message", (event) => {
                const state = event.data as PasswordResetWorkerState
                if (state.type === "field-password") {
                    stateChanged(state.state)
                }
            })
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

function mapPasswordResetState(state: PasswordResetState): PasswordResetWorkerState {
    return { type: "password_reset", state }
}
function mapLoginIDFieldState(state: LoginIDFieldState): PasswordResetWorkerState {
    return { type: "field-login_id", state }
}
function mapPasswordFieldState(state: PasswordFieldState): PasswordResetWorkerState {
    return { type: "field-password", state }
}

interface Publisher<T> {
    (state: T): void
}

type WorkerHolder =
    Readonly<{ set: false, stack: WorkerSetup[], init: WorkerInit }> |
    Readonly<{ set: true, instance: Worker }>

interface WorkerInit {
    (): Worker
}
interface WorkerSetup {
    (worker: Worker): void
}
