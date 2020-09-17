import {
    PasswordResetComponentAction,
    PasswordResetComponent,
    PasswordResetWorkerComponentHelper,
} from "./component"

import {
    PasswordResetComponentState,
    PasswordResetComponentOperation,
    PasswordResetWorkerComponentState,
} from "./data"

import { LoginIDFieldComponentState } from "../field/login_id/data"
import { PasswordFieldComponentState } from "../field/password/data"

import { LoginIDField } from "../../field/login_id/action"
import { PasswordField } from "../../field/password/action"

import { LoginID } from "../../login_id/data"
import { Password } from "../../password/data"
import { ResetToken, ResetEvent } from "../../password_reset/data"
import { Content } from "../../field/data"

export function initPasswordResetComponent(action: PasswordResetComponentAction): PasswordResetComponent {
    return new Component(action)
}
export function initPasswordResetWorkerComponent(init: WorkerInit): PasswordResetComponent {
    return new WorkerComponent(init)
}
export function initPasswordResetWorkerComponentHelper(): PasswordResetWorkerComponentHelper {
    return {
        mapPasswordResetComponentState,
        mapLoginIDFieldComponentState,
        mapPasswordFieldComponentState,
    }
}

class Component implements PasswordResetComponent {
    action: PasswordResetComponentAction

    holder: PublisherHolder<PasswordResetComponentState>

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

        this.holder = { set: false }

        this.field = {
            loginID: this.action.loginIDField.initLoginIDField(),
            password: this.action.passwordField.initPasswordField(),
        }

        this.content = {
            loginID: { input: { inputValue: "" }, valid: false },
            password: { input: { inputValue: "" }, valid: false },
        }

        this.field.loginID.sub.onLoginIDFieldContentChanged((content: Content<LoginID>) => {
            this.content.loginID = content
        })
        this.field.password.sub.onPasswordFieldContentChanged((content: Content<Password>) => {
            this.content.password = content
        })
    }

    hook(pub: Publisher<PasswordResetComponentState>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<PasswordResetComponentState>): void {
        this.action.passwordReset.sub.onResetEvent((event) => {
            const state = map(event)
            if (this.holder.set) {
                this.holder.pub(state)
            }
            stateChanged(state)

            function map(event: ResetEvent): PasswordResetComponentState {
                return event
            }
        })
    }
    initLoginIDField(stateChanged: Publisher<LoginIDFieldComponentState>): void {
        this.field.loginID.sub.onLoginIDFieldStateChanged(stateChanged)
    }
    initPasswordField(stateChanged: Publisher<PasswordFieldComponentState>): void {
        this.field.password.sub.onPasswordFieldStateChanged(stateChanged)
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
    holder: PublisherHolder<PasswordResetComponentState>

    constructor(init: WorkerInit) {
        this.worker = { set: false, init }
        this.holder = { set: false }
    }

    hook(pub: Publisher<PasswordResetComponentState>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<PasswordResetComponentState>): void {
        if (!this.worker.set) {
            this.worker = {
                set: true,
                instance: this.initWorker(this.worker.init, (state) => {
                    if (this.holder.set) {
                        this.holder.pub(state)
                    }
                    stateChanged(state)
                }),
            }
        }
    }
    initWorker(init: WorkerInit, stateChanged: Publisher<PasswordResetComponentState>): Worker {
        const worker = init()
        worker.addEventListener("message", (event) => {
            const state = event.data as PasswordResetWorkerComponentState
            if (state.type === "password_reset") {
                stateChanged(state.state)
            }
        })
        return worker
    }

    initLoginIDField(stateChanged: Publisher<LoginIDFieldComponentState>): void {
        if (this.worker.set) {
            this.worker.instance.addEventListener("message", (event) => {
                const state = event.data as PasswordResetWorkerComponentState
                if (state.type === "field-login_id") {
                    stateChanged(state.state)
                }
            })
        }
    }
    initPasswordField(stateChanged: Publisher<PasswordFieldComponentState>): void {
        if (this.worker.set) {
            this.worker.instance.addEventListener("message", (event) => {
                const state = event.data as PasswordResetWorkerComponentState
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

function mapPasswordResetComponentState(state: PasswordResetComponentState): PasswordResetWorkerComponentState {
    return { type: "password_reset", state }
}
function mapLoginIDFieldComponentState(state: LoginIDFieldComponentState): PasswordResetWorkerComponentState {
    return { type: "field-login_id", state }
}
function mapPasswordFieldComponentState(state: PasswordFieldComponentState): PasswordResetWorkerComponentState {
    return { type: "field-password", state }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}

type WorkerHolder =
    Readonly<{ set: false, init: WorkerInit }> |
    Readonly<{ set: true, instance: Worker }>

interface WorkerInit {
    (): Worker
}
