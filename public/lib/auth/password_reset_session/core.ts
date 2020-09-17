import {
    PasswordResetSessionComponentAction,
    PasswordResetSessionComponent,
    PasswordResetSessionComponentState,
    PasswordResetSessionComponentOperation,
    PasswordResetSessionWorkerComponentHelper,
    PasswordResetSessionWorkerComponentState,
} from "./action"

import { LoginIDFieldComponentState } from "../field/login_id/data"

import { LoginID } from "../../credential/data"
import { CreateSessionEvent, PollingStatusEvent } from "../../password_reset/data"
import { LoginIDField } from "../../field/login_id/action"
import { Content } from "../../field/data"

export function initPasswordResetSessionComponent(action: PasswordResetSessionComponentAction): PasswordResetSessionComponent {
    return new Component(action)
}
export function initPasswordResetSessionWorkerComponent(init: WorkerInit): PasswordResetSessionComponent {
    return new WorkerComponent(init)
}
export function initPasswordResetSessionWorkerComponentHelper(): PasswordResetSessionWorkerComponentHelper {
    return {
        mapPasswordResetSessionComponentState,
        mapLoginIDFieldComponentState,
    }
}

class Component implements PasswordResetSessionComponent {
    action: PasswordResetSessionComponentAction

    field: {
        loginID: LoginIDField
    }

    content: {
        loginID: Content<LoginID>
    }

    constructor(action: PasswordResetSessionComponentAction) {
        this.action = action

        this.field = {
            loginID: action.loginIDField.initLoginIDField(),
        }

        this.content = {
            loginID: { input: { inputValue: "" }, valid: false },
        }

        this.field.loginID.sub.onLoginIDFieldContentChanged((content: Content<LoginID>) => {
            this.content.loginID = content
        })
    }

    init(stateChanged: Publisher<PasswordResetSessionComponentState>): void {
        this.action.passwordReset.sub.onCreateSessionEvent((event) => {
            stateChanged(map(event, this.action))

            function map(event: CreateSessionEvent, action: PasswordResetSessionComponentAction): PasswordResetSessionComponentState {
                switch (event.type) {
                    case "try-to-create-session":
                    case "delayed-to-create-session":
                    case "failed-to-create-session":
                        return event

                    case "succeed-to-create-session":
                        action.passwordReset.startPollingStatus(event.session)
                        return { type: "try-to-polling-status" }
                }
            }
        })
        this.action.passwordReset.sub.onPollingStatusEvent((event) => {
            stateChanged(map(event))

            function map(event: PollingStatusEvent): PasswordResetSessionComponentState {
                return event
            }
        })
    }
    initLoginIDField(stateChanged: Publisher<LoginIDFieldComponentState>): void {
        this.field.loginID.sub.onLoginIDFieldStateChanged(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
    trigger(operation: PasswordResetSessionComponentOperation): Promise<void> {
        switch (operation.type) {
            case "create-session":
                return this.createSession()

            case "field-login_id":
                return Promise.resolve(this.field.loginID.trigger(operation.operation))
        }
    }

    createSession(): Promise<void> {
        this.field.loginID.validate()
        return this.action.passwordReset.createSession([this.content.loginID])
    }
}

class WorkerComponent implements PasswordResetSessionComponent {
    worker: WorkerHolder
    holder: PublisherHolder<PasswordResetSessionComponentState>

    constructor(init: WorkerInit) {
        this.worker = { set: false, init }
        this.holder = { set: false }
    }

    hook(pub: Publisher<PasswordResetSessionComponentState>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<PasswordResetSessionComponentState>): void {
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
    initWorker(init: WorkerInit, stateChanged: Publisher<PasswordResetSessionComponentState>): Worker {
        const worker = init()
        worker.addEventListener("message", (event) => {
            const state = event.data as PasswordResetSessionWorkerComponentState
            if (state.type === "password_login") {
                stateChanged(state.state)
            }
        })
        return worker
    }

    initLoginIDField(stateChanged: Publisher<LoginIDFieldComponentState>): void {
        if (this.worker.set) {
            this.worker.instance.addEventListener("message", (event) => {
                const state = event.data as PasswordResetSessionWorkerComponentState
                if (state.type === "field-login_id") {
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

    async trigger(operation: PasswordResetSessionComponentOperation): Promise<void> {
        if (this.worker.set) {
            this.worker.instance.postMessage(operation)
        }
    }
}

function mapPasswordResetSessionComponentState(state: PasswordResetSessionComponentState): PasswordResetSessionWorkerComponentState {
    return { type: "password_login", state }
}
function mapLoginIDFieldComponentState(state: LoginIDFieldComponentState): PasswordResetSessionWorkerComponentState {
    return { type: "field-login_id", state }
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
