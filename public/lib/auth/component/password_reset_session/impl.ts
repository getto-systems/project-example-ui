import {
    PasswordResetSessionComponentAction,
    PasswordResetSessionComponent,
    PasswordResetSessionState,
    PasswordResetSessionComponentOperation,
    PasswordResetSessionWorkerState,
    PasswordResetSessionWorkerComponentHelper,
} from "../password_reset_session/component"

import { LoginIDFieldState } from "../field/login_id/component"

import { LoginIDField } from "../../../field/login_id/action"

import { LoginID } from "../../../login_id/data"
import { StartSessionEvent, PollingStatusEvent } from "../../../password_reset/data"
import { LoginIDFieldEvent } from "../../../field/login_id/data"
import { Content } from "../../../field/data"

export function initPasswordResetSessionComponent(action: PasswordResetSessionComponentAction): PasswordResetSessionComponent {
    return new Component(action)
}
export function initPasswordResetSessionWorkerComponent(init: WorkerInit): PasswordResetSessionComponent {
    return new WorkerComponent(init)
}
export function initPasswordResetSessionWorkerComponentHelper(): PasswordResetSessionWorkerComponentHelper {
    return {
        mapPasswordResetSessionState,
        mapLoginIDFieldState,
    }
}

class Component implements PasswordResetSessionComponent {
    action: PasswordResetSessionComponentAction
    listener: Post<PasswordResetSessionState>[]

    field: {
        loginID: LoginIDField
    }

    content: {
        loginID: Content<LoginID>
    }

    constructor(action: PasswordResetSessionComponentAction) {
        this.action = action
        this.action.passwordReset.sub.onStartSessionEvent((event) => {
            switch (event.type) {
                case "succeed-to-start-session":
                    this.action.passwordReset.startPollingStatus(event.sessionID)
                    break
            }

            const state = mapStartSessionEvent(event)
            this.listener.forEach(post => post(state))
        })
        this.action.passwordReset.sub.onPollingStatusEvent((event) => {
            const state = mapPollingStatusEvent(event)
            this.listener.forEach(post => post(state))
        })

        this.listener = []

        this.field = {
            loginID: action.loginIDField.initLoginIDField(),
        }

        this.content = {
            loginID: { valid: false },
        }

        this.field.loginID.sub.onLoginIDFieldEvent((event: LoginIDFieldEvent) => {
            this.content.loginID = event.content
        })
    }

    onStateChange(stateChanged: Post<PasswordResetSessionState>): void {
        this.listener.push(stateChanged)
    }
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void {
        this.field.loginID.sub.onLoginIDFieldEvent(stateChanged)
    }

    init(): Terminate {
        return () => this.terminate()
    }
    terminate(): void {
        // WorkerComponent とインターフェイスを合わせるために必要
    }
    trigger(operation: PasswordResetSessionComponentOperation): Promise<void> {
        switch (operation.type) {
            case "start-session":
                return this.startSession()

            case "field-login_id":
                return Promise.resolve(this.field.loginID.trigger(operation.operation))
        }
    }

    startSession(): Promise<void> {
        this.field.loginID.validate()
        return this.action.passwordReset.startSession([this.content.loginID])
    }
}

class WorkerComponent implements PasswordResetSessionComponent {
    worker: WorkerHolder

    listener: {
        passwordResetSession: Post<PasswordResetSessionState>[]
        loginID: Post<LoginIDFieldState>[]
    }

    constructor(init: WorkerInit) {
        this.worker = { set: false, init }
        this.listener = {
            passwordResetSession: [],
            loginID: [],
        }
    }

    onStateChange(stateChanged: Post<PasswordResetSessionState>): void {
        this.listener.passwordResetSession.push(stateChanged)
    }
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void {
        this.listener.loginID.push(stateChanged)
    }

    init(): Terminate {
        this.initComponent()
        return () => this.terminate()
    }
    initComponent(): void {
        if (!this.worker.set) {
            const instance = this.worker.init()

            instance.addEventListener("message", (event) => {
                const state = event.data as PasswordResetSessionWorkerState
                switch (state.type) {
                    case "password_reset_session":
                        this.listener.passwordResetSession.forEach(post => post(state.state))
                        return

                    case "field-login_id":
                        this.listener.loginID.forEach(post => post(state.state))
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

    async trigger(operation: PasswordResetSessionComponentOperation): Promise<void> {
        if (this.worker.set) {
            this.worker.instance.postMessage(operation)
        }
    }
}

function mapStartSessionEvent(event: StartSessionEvent): PasswordResetSessionState {
    switch (event.type) {
        case "try-to-start-session":
        case "delayed-to-start-session":
        case "failed-to-start-session":
            return event

        case "succeed-to-start-session":
            return { type: "try-to-polling-status" }
    }
}
function mapPollingStatusEvent(event: PollingStatusEvent): PasswordResetSessionState {
    return event
}

function mapPasswordResetSessionState(state: PasswordResetSessionState): PasswordResetSessionWorkerState {
    return { type: "password_reset_session", state }
}
function mapLoginIDFieldState(state: LoginIDFieldState): PasswordResetSessionWorkerState {
    return { type: "field-login_id", state }
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
