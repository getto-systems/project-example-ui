import {
    PasswordLoginComponentAction,
    PasswordLoginComponent,
    PasswordLoginComponentState,
    PasswordLoginComponentOperation,
    PasswordLoginComponentField,
} from "./action"

import { LoginID } from "../../credential/data"
import { Password } from "../../password/data"
import { LoginEvent } from "../../password_login/data"
import { Content } from "../../field/data"

export function initPasswordLoginComponent(
    action: PasswordLoginComponentAction,
    field: PasswordLoginComponentField,
): PasswordLoginComponent {
    return new Component(action, field)
}
export function initPasswordLoginWorkerComponent(init: WorkerInit, field: PasswordLoginComponentField): PasswordLoginComponent {
    return new WorkerComponent(init, field)
}

class Component implements PasswordLoginComponent {
    action: PasswordLoginComponentAction
    field: PasswordLoginComponentField

    holder: PublisherHolder<PasswordLoginComponentState>

    content: {
        loginID: Content<LoginID>
        password: Content<Password>
    }

    constructor(action: PasswordLoginComponentAction, field: PasswordLoginComponentField) {
        this.action = action
        this.field = field

        this.holder = { set: false }

        this.content = {
            loginID: { input: { inputValue: "" }, valid: false },
            password: { input: { inputValue: "" }, valid: false },
        }

        this.field.loginID.onContentChange((content: Content<LoginID>) => {
            this.content.loginID = content
        })
        this.field.password.onContentChange((content: Content<Password>) => {
            this.content.password = content
        })
    }

    hook(pub: Publisher<PasswordLoginComponentState>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<PasswordLoginComponentState>): void {
        this.action.passwordLogin.sub.onLoginEvent((event) => {
            const state = map(event)
            if (this.holder.set) {
                this.holder.pub(state)
            }
            stateChanged(state)

            function map(event: LoginEvent): PasswordLoginComponentState {
                return event
            }
        })
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
    trigger(_operation: PasswordLoginComponentOperation): Promise<void> {
        // "login" だけなので単に呼び出す
        return this.login()
    }

    async login(): Promise<void> {
        await Promise.all([
            this.field.loginID.field.validate(),
            this.field.password.field.validate(),
        ])

        await this.action.passwordLogin.login([
            this.content.loginID,
            this.content.password,
        ])
    }
}

class WorkerComponent implements PasswordLoginComponent {
    worker: WorkerHolder
    holder: PublisherHolder<PasswordLoginComponentState>

    field: PasswordLoginComponentField

    constructor(init: WorkerInit, field: PasswordLoginComponentField) {
        this.worker = { set: false, init }
        this.holder = { set: false }

        this.field = field
    }

    hook(pub: Publisher<PasswordLoginComponentState>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<PasswordLoginComponentState>): void {
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
    initWorker(init: WorkerInit, stateChanged: Publisher<PasswordLoginComponentState>): Worker {
        const worker = init()
        worker.addEventListener("message", (event) => {
            stateChanged(event.data)
        })
        return worker
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
