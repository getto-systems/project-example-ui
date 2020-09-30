import {
    PasswordResetSessionComponent,
    PasswordResetSessionComponentResource,
    PasswordResetSessionState,
    PasswordResetSessionOperation,
    PasswordResetSessionWorkerState,
    PasswordResetSessionWorkerComponentHelper,
} from "../password_reset_session/component"

import { LoginIDFieldState } from "../field/login_id/component"

import { PasswordResetAction } from "../../../password_reset/action"
import { LoginIDFieldAction } from "../../../login_id/field/action"

import { LoginIDField } from "../../../login_id/field/action"

import { LoginID } from "../../../login_id/data"
import { StartSessionEvent, PollingStatusEvent } from "../../../password_reset/data"
import { LoginIDFieldEvent } from "../../../login_id/field/data"
import { Content, invalidContent } from "../../../field/data"

type Action = Readonly<{
    passwordReset: PasswordResetAction
    loginIDField: LoginIDFieldAction
}>

export function initPasswordResetSessionComponent(action: Action): PasswordResetSessionComponent {
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
    action: Action

    listener: Post<PasswordResetSessionState>[] = []

    field: {
        loginID: LoginIDField
    }

    content: {
        loginID: Content<LoginID>
    } = {
            loginID: invalidContent(),
        }

    constructor(action: Action) {
        this.action = action
        this.action.passwordReset.sub.onStartSessionEvent((event) => {
            this.post(this.mapStartSessionEvent(event))
        })
        this.action.passwordReset.sub.onPollingStatusEvent((event) => {
            this.post(this.mapPollingStatusEvent(event))
        })

        this.field = {
            loginID: action.loginIDField.initLoginIDField(),
        }

        this.field.loginID.sub.onLoginIDFieldEvent((event: LoginIDFieldEvent) => {
            this.content.loginID = event.content
        })
    }
    post(state: PasswordResetSessionState): void {
        this.listener.forEach(post => post(state))
    }
    mapStartSessionEvent(event: StartSessionEvent): PasswordResetSessionState {
        switch (event.type) {
            case "try-to-start-session":
            case "delayed-to-start-session":
            case "failed-to-start-session":
                return event

            case "succeed-to-start-session":
                this.action.passwordReset.startPollingStatus(event.sessionID)
                return { type: "try-to-polling-status" }
        }
    }
    mapPollingStatusEvent(event: PollingStatusEvent): PasswordResetSessionState {
        return event
    }

    onStateChange(stateChanged: Post<PasswordResetSessionState>): void {
        this.listener.push(stateChanged)
    }
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void {
        this.field.loginID.sub.onLoginIDFieldEvent(stateChanged)
    }

    init(): PasswordResetSessionComponentResource {
        return {
            request: operation => this.request(operation),
            terminate: () => { /* WorkerComponent とインターフェイスを合わせるために必要 */ },
        }
    }
    request(operation: PasswordResetSessionOperation): void {
        switch (operation.type) {
            case "start-session":
                this.field.loginID.validate()
                this.action.passwordReset.startSession(this.content)
                return

            case "field-login_id":
                this.field.loginID.trigger(operation.operation)
                return

            default:
                assertNever(operation)
        }
    }
}

class WorkerComponent implements PasswordResetSessionComponent {
    worker: WorkerHolder

    listener: {
        passwordResetSession: Post<PasswordResetSessionState>[]
        loginID: Post<LoginIDFieldState>[]
    } = {
            passwordResetSession: [],
            loginID: [],
        }

    constructor(init: WorkerInit) {
        this.worker = { set: false, init }
    }

    onStateChange(stateChanged: Post<PasswordResetSessionState>): void {
        this.listener.passwordResetSession.push(stateChanged)
    }
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void {
        this.listener.loginID.push(stateChanged)
    }

    init(): PasswordResetSessionComponentResource {
        this.initComponent()
        return {
            request: operation => this.request(operation),
            terminate: () => this.terminate(),
        }
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

    request(operation: PasswordResetSessionOperation): void {
        if (this.worker.set) {
            this.worker.instance.postMessage(operation)
        }
    }
}

function mapPasswordResetSessionState(state: PasswordResetSessionState): PasswordResetSessionWorkerState {
    return { type: "password_reset_session", state }
}
function mapLoginIDFieldState(state: LoginIDFieldState): PasswordResetSessionWorkerState {
    return { type: "field-login_id", state }
}

type WorkerHolder =
    Readonly<{ set: false, init: WorkerInit }> |
    Readonly<{ set: true, instance: Worker }>

interface WorkerInit {
    (): Worker
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
