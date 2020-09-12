import { LoginIDFieldComponent, LoginIDFieldComponentEventInit } from "../../field/login_id/action"
import { PasswordFieldComponent, PasswordFieldComponentEventInit } from "../../field/password/action"

import { AuthComponentEvent } from "../../../auth/action"
import {
    PasswordLoginComponentAction,
    PasswordLoginComponent,
    PasswordLoginComponentState,
    PasswordLoginComponentEvent,
    PasswordLoginComponentEventInit,
    PasswordLoginComponentStateHandler,
    SubmitHandler,
} from "../action"

import { LoginID, StoreError } from "../../../credential/data"
import { Password } from "../../../password/data"
import { InputContent, LoginError } from "../../../password_login/data"
import { Content } from "../../../input/data"

export function initPasswordLoginComponent(
    loginID: [LoginIDFieldComponent, LoginIDFieldComponentEventInit],
    password: [PasswordFieldComponent, PasswordFieldComponentEventInit],
    action: PasswordLoginComponentAction,
): PasswordLoginComponent {
    return new Component(loginID, password, action)
}
export function initPasswordLoginComponentEvent(authEvent: AuthComponentEvent): PasswordLoginComponentEventInit {
    return (stateChanged) => new ComponentEvent(authEvent, stateChanged)
}

class Component implements PasswordLoginComponent {
    loginID: [LoginIDFieldComponent, LoginIDFieldComponentEventInit]
    password: [PasswordFieldComponent, PasswordFieldComponentEventInit]

    action: PasswordLoginComponentAction

    initialState: PasswordLoginComponentState = { type: "initial-login" }

    submitHandlers: Array<SubmitHandler>

    content: {
        loginID: Content<LoginID>
        password: Content<Password>
    }

    constructor(
        loginID: [LoginIDFieldComponent, LoginIDFieldComponentEventInit],
        password: [PasswordFieldComponent, PasswordFieldComponentEventInit],
        action: PasswordLoginComponentAction,
    ) {
        this.loginID = loginID
        this.password = password

        this.action = action

        this.submitHandlers = []

        this.content = {
            loginID: { input: { inputValue: "" }, valid: false },
            password: { input: { inputValue: "" }, valid: false },
        }

        this.loginID[0].onChange((content: Content<LoginID>) => {
            this.content.loginID = content
        })
        this.password[0].onChange((content: Content<Password>) => {
            this.content.password = content
        })
    }

    onSubmit(handler: SubmitHandler): void {
        this.submitHandlers.push(handler)
    }

    async login(event: PasswordLoginComponentEvent): Promise<void> {
        await Promise.all(this.submitHandlers.map((handler) => handler()))

        const result = await this.action.passwordLogin.login(event, [
            this.content.loginID,
            this.content.password,
        ])
        if (!result.success) {
            return
        }

        await this.action.credential.store(event, result.authCredential)
    }
}

class ComponentEvent implements PasswordLoginComponentEvent {
    authEvent: AuthComponentEvent
    stateChanged: PasswordLoginComponentStateHandler

    constructor(authEvent: AuthComponentEvent, stateChanged: PasswordLoginComponentStateHandler) {
        this.authEvent = authEvent
        this.stateChanged = stateChanged
    }

    tryToLogin(): void {
        this.stateChanged({ type: "try-to-login" })
    }
    delayedToLogin(): void {
        this.stateChanged({ type: "delayed-to-login" })
    }
    failedToLogin(content: InputContent, err: LoginError): void {
        this.stateChanged({ type: "failed-to-login", content, err })
    }

    failedToStore(err: StoreError): void {
        this.stateChanged({ type: "failed-to-store", err })
    }
    succeedToStore(): void {
        this.authEvent.succeedToAuth()
    }
}
