import { PasswordLoginComponentAction, PasswordLoginComponent, PasswordLoginWorkerComponentHelper } from "./component"

import { PasswordLoginState, PasswordLoginComponentOperation, PasswordLoginWorkerState } from "./data"

import { LoginIDFieldState } from "../field/login_id/data"
import { PasswordFieldState } from "../field/password/data"

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

    hook(post: Post<PasswordLoginState>): void {
        this.listener.push(post)
    }
    onStateChange(stateChanged: Post<PasswordLoginState>): void {
        this.action.passwordLogin.sub.onLoginEvent((event) => {
            const state = map(event)
            this.listener.forEach(post => post(state))
            stateChanged(state)

            function map(event: LoginEvent): PasswordLoginState {
                return event
            }
        })
    }
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void {
        this.field.loginID.sub.onLoginIDFieldEvent(stateChanged)
    }
    onPasswordFieldStateChange(stateChanged: Post<PasswordFieldState>): void {
        this.field.password.sub.onPasswordFieldEvent(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
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
    listener: Post<PasswordLoginState>[]

    constructor(init: WorkerInit) {
        this.worker = { set: false, stack: [], init }
        this.listener = []
    }

    hook(post: Post<PasswordLoginState>): void {
        this.listener.push(post)
    }
    onStateChange(stateChanged: Post<PasswordLoginState>): void {
        if (!this.worker.set) {
            const instance = this.initWorker(this.worker.init, this.worker.stack, (state) => {
                this.listener.forEach(post => post(state))
                stateChanged(state)
            })

            this.worker = { set: true, instance }
        }
    }
    initWorker(init: WorkerInit, stack: WorkerSetup[], stateChanged: Post<PasswordLoginState>): Worker {
        const worker = init()
        worker.addEventListener("message", (event) => {
            const state = event.data as PasswordLoginWorkerState
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
                const state = event.data as PasswordLoginWorkerState
                if (state.type === "field-login_id") {
                    stateChanged(state.state)
                }
            })
        }
    }
    onPasswordFieldStateChange(stateChanged: Post<PasswordFieldState>): void {
        if (this.worker.set) {
            setup(this.worker.instance)
        } else {
            this.worker.stack.push(setup)
        }

        function setup(worker: Worker): void {
            worker.addEventListener("message", (event) => {
                const state = event.data as PasswordLoginWorkerState
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

    async trigger(operation: PasswordLoginComponentOperation): Promise<void> {
        if (this.worker.set) {
            this.worker.instance.postMessage(operation)
        }
    }
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
    Readonly<{ set: false, stack: WorkerSetup[], init: WorkerInit }> |
    Readonly<{ set: true, instance: Worker }>

interface WorkerInit {
    (): Worker
}

interface WorkerSetup {
    (worker: Worker): void
}
