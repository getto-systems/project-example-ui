import {
    PasswordResetSessionComponentAction,
    PasswordResetSessionComponent,
    PasswordResetSessionWorkerComponentHelper,
} from "./component"

import {
    PasswordResetSessionState,
    PasswordResetSessionComponentOperation,
    PasswordResetSessionWorkerState,
} from "./data"

import { LoginIDFieldState } from "../field/login_id"

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
            loginID: { valid: false },
        }

        this.field.loginID.sub.onLoginIDFieldEvent((event: LoginIDFieldEvent) => {
            this.content.loginID = event.content
        })
    }

    onStateChange(stateChanged: Post<PasswordResetSessionState>): void {
        this.action.passwordReset.sub.onStartSessionEvent((event) => {
            stateChanged(map(event, this.action))

            function map(event: StartSessionEvent, action: PasswordResetSessionComponentAction): PasswordResetSessionState {
                switch (event.type) {
                    case "try-to-start-session":
                    case "delayed-to-start-session":
                    case "failed-to-start-session":
                        return event

                    case "succeed-to-start-session":
                        action.passwordReset.startPollingStatus(event.sessionID)
                        return { type: "try-to-polling-status" }
                }
            }
        })
        this.action.passwordReset.sub.onPollingStatusEvent((event) => {
            stateChanged(map(event))

            function map(event: PollingStatusEvent): PasswordResetSessionState {
                return event
            }
        })
    }
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void {
        this.field.loginID.sub.onLoginIDFieldEvent(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
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

    constructor(init: WorkerInit) {
        this.worker = { set: false, stack: [], init }
    }

    onStateChange(stateChanged: Post<PasswordResetSessionState>): void {
        if (!this.worker.set) {
            const instance = this.initWorker(this.worker.init, this.worker.stack, (state) => {
                stateChanged(state)
            })
            this.worker = { set: true, instance }
        }
    }
    initWorker(init: WorkerInit, stack: WorkerSetup[], stateChanged: Post<PasswordResetSessionState>): Worker {
        const worker = init()
        worker.addEventListener("message", (event) => {
            const state = event.data as PasswordResetSessionWorkerState
            if (state.type === "password_login") {
                stateChanged(state.state)
            }
        })
        stack.forEach((setup) => {
            setup(worker)
        })
        return worker
    }

    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void {
        if (this.worker.set) {
            setup(this.worker.instance)
        } else {
            this.worker.stack.push(setup)
        }

        function setup(worker: Worker): void {
            worker.addEventListener("message", (event) => {
                const state = event.data as PasswordResetSessionWorkerState
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

function mapPasswordResetSessionState(state: PasswordResetSessionState): PasswordResetSessionWorkerState {
    return { type: "password_login", state }
}
function mapLoginIDFieldState(state: LoginIDFieldState): PasswordResetSessionWorkerState {
    return { type: "field-login_id", state }
}

interface Post<T> {
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
