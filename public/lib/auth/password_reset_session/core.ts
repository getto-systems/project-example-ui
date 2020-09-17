import {
    PasswordResetSessionComponentAction,
    PasswordResetSessionComponent,
    PasswordResetSessionComponentState,
    PasswordResetSessionComponentOperation,
} from "./action"

import { LoginIDFieldComponentState } from "../field/login_id/data"

import { LoginID } from "../../credential/data"
import { CreateSessionEvent, PollingStatusEvent } from "../../password_reset_session/data"
import { LoginIDField } from "../../field/login_id/action"
import { Content } from "../../field/data"

export function initPasswordResetSessionComponent(action: PasswordResetSessionComponentAction): PasswordResetSessionComponent {
    return new Component(action)
}

class Component implements PasswordResetSessionComponent {
    action: PasswordResetSessionComponentAction

    holder: PublisherHolder<PasswordResetSessionComponentState>

    field: {
        loginID: LoginIDField
    }

    content: {
        loginID: Content<LoginID>
    }

    constructor(action: PasswordResetSessionComponentAction) {
        this.action = action

        this.holder = { set: false }

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

    hook(pub: Publisher<PasswordResetSessionComponentState>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<PasswordResetSessionComponentState>): void {
        this.action.passwordResetSession.sub.onCreateSessionEvent((event) => {
            const state = map(event, this.action)
            if (this.holder.set) {
                this.holder.pub(state)
            }
            stateChanged(state)

            function map(event: CreateSessionEvent, action: PasswordResetSessionComponentAction): PasswordResetSessionComponentState {
                switch (event.type) {
                    case "try-to-create-session":
                    case "delayed-to-create-session":
                    case "failed-to-create-session":
                        return event

                    case "succeed-to-create-session":
                        action.passwordResetSession.startPollingStatus(event.session)
                        return { type: "try-to-polling-status" }
                }
            }
        })
        this.action.passwordResetSession.sub.onPollingStatusEvent((event) => {
            const state = map(event)
            if (this.holder.set) {
                this.holder.pub(state)
            }
            stateChanged(state)

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
        return this.action.passwordResetSession.createSession([this.content.loginID])
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
