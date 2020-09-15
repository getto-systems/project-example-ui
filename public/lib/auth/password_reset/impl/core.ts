import { AuthComponentEventPublisher } from "../../../auth/action"
import {
    PasswordResetComponentAction,
    PasswordResetComponent,
    PasswordResetComponentState,
    PasswordResetComponentEvent,
    PasswordResetComponentEventInit,
    PasswordResetComponentStateHandler,
} from "../action"

import { LoginIDFieldComponent } from "../../field/login_id/data"
import { PasswordFieldComponent } from "../../field/password/data"

import { LoginID, StoreError } from "../../../credential/data"
import { Password } from "../../../password/data"
import { InputContent, ResetToken, ResetError } from "../../../password_reset/data"
import { Content } from "../../../input/data"

export function initPasswordResetComponent(
    loginID: LoginIDFieldComponent,
    password: PasswordFieldComponent,
    action: PasswordResetComponentAction,
    resetToken: ResetToken,
): PasswordResetComponent {
    return new Component(loginID, password, action, resetToken)
}
export function initPasswordResetComponentEvent(authEvent: AuthComponentEventPublisher): PasswordResetComponentEventInit {
    return (stateChanged) => new ComponentEvent(authEvent, stateChanged)
}

class Component implements PasswordResetComponent {
    loginID: LoginIDFieldComponent
    password: PasswordFieldComponent

    action: PasswordResetComponentAction

    resetToken: ResetToken

    content: {
        loginID: Content<LoginID>
        password: Content<Password>
    }

    initialState: PasswordResetComponentState = { type: "initial-reset" }

    constructor(
        loginID: LoginIDFieldComponent,
        password: PasswordFieldComponent,
        action: PasswordResetComponentAction,
        resetToken: ResetToken,
    ) {
        this.loginID = loginID
        this.password = password

        this.action = action

        this.resetToken = resetToken

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

    async reset(event: PasswordResetComponentEvent): Promise<void> {
        const result = await this.action.passwordReset.reset(event, this.resetToken, await Promise.all([
            this.content.loginID,
            this.content.password,
        ]))
        if (!result.success) {
            return
        }

        await this.action.credential.store(event, result.authCredential)
    }
}

class ComponentEvent implements PasswordResetComponentEvent {
    stateChanged: PasswordResetComponentStateHandler
    authEvent: AuthComponentEventPublisher

    constructor(authEvent: AuthComponentEventPublisher, stateChanged: PasswordResetComponentStateHandler) {
        this.stateChanged = stateChanged
        this.authEvent = authEvent
    }

    tryToReset(): void {
        this.stateChanged({ type: "try-to-reset" })
    }
    delayedToReset(): void {
        this.stateChanged({ type: "delayed-to-reset" })
    }
    failedToReset(content: InputContent, err: ResetError): void {
        this.stateChanged({ type: "failed-to-reset", content, err })
    }

    failedToStore(err: StoreError): void {
        this.stateChanged({ type: "failed-to-store", err })
    }
    succeedToStore(): void {
        this.authEvent.succeedToAuth()
    }
}
