import {
    PasswordLoginComponentAction,
    PasswordLoginComponent,
    PasswordLoginComponentState,
    PasswordLoginComponentEvent,
    PasswordLoginComponentEventInit,
    PasswordLoginComponentStateHandler,
    SubmitHandler,
} from "./action"

import { AuthUsecaseEventHandler } from "../../auth/data"
import { LoginIDFieldComponent } from "../field/login_id/data"
import { PasswordFieldComponent } from "../field/password/data"

import { LoginID, StoreError } from "../../credential/data"
import { Password } from "../../password/data"
import { InputContent, LoginError } from "../../password_login/data"
import { Content } from "../../field/data"

// TODO loginID と password を fields にまとめたい
export function initPasswordLoginComponent(
    loginID: LoginIDFieldComponent,
    password: PasswordFieldComponent,
    action: PasswordLoginComponentAction,
): PasswordLoginComponent {
    return new Component(loginID, password, action)
}
export function initPasswordLoginComponentEvent(authEvent: AuthUsecaseEventHandler): PasswordLoginComponentEventInit {
    return (stateChanged) => new ComponentEvent(authEvent, stateChanged)
}

class Component implements PasswordLoginComponent {
    loginID: LoginIDFieldComponent
    password: PasswordFieldComponent

    action: PasswordLoginComponentAction

    initialState: PasswordLoginComponentState = { type: "initial-login" }

    submitHandlers: Array<SubmitHandler>

    content: {
        loginID: Content<LoginID>
        password: Content<Password>
    }

    constructor(
        loginID: LoginIDFieldComponent,
        password: PasswordFieldComponent,
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

        this.loginID.onContentChange((content: Content<LoginID>) => {
            this.content.loginID = content
        })
        this.password.onContentChange((content: Content<Password>) => {
            this.content.password = content
        })
    }

    onSubmit(handler: SubmitHandler): void {
        this.submitHandlers.push(handler)
    }

    async login(event: PasswordLoginComponentEvent): Promise<void> {
        await Promise.all(this.submitHandlers.map((handler) => handler()))

        const result = await this.action.passwordLogin.loginDeprecated(event, [
            this.content.loginID,
            this.content.password,
        ])
        if (!result.success) {
            return
        }

        await this.action.credential.storeDeprecated(event, result.authCredential)
    }
}

class ComponentEvent implements PasswordLoginComponentEvent {
    authEvent: AuthUsecaseEventHandler
    stateChanged: PasswordLoginComponentStateHandler

    constructor(authEvent: AuthUsecaseEventHandler, stateChanged: PasswordLoginComponentStateHandler) {
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
        this.authEvent.handleAuthEvent({ type: "succeed-to-login" })
    }
}
