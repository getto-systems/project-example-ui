import {
    PasswordResetSessionComponentAction,
    PasswordResetSessionComponent,
    PasswordResetSessionComponentState,
    PasswordResetSessionComponentEvent,
    PasswordResetSessionComponentEventInit,
    PasswordResetSessionComponentStateHandler,
} from "../action"

import { LoginIDFieldComponent } from "../../field/login_id/data"

import { LoginID } from "../../../credential/data"
import { InputContent, SessionError, PollingStatusError, PollingStatus, DoneStatus } from "../../../password_reset_session/data"
import { Content } from "../../../input/data"

export function initPasswordResetSessionComponent(
    loginID: LoginIDFieldComponent,
    action: PasswordResetSessionComponentAction,
): PasswordResetSessionComponent {
    return new Component(loginID, action)
}
export function initPasswordResetSessionComponentEvent(): PasswordResetSessionComponentEventInit {
    return (stateChanged) => new ComponentEvent(stateChanged)
}

class Component implements PasswordResetSessionComponent {
    loginID: LoginIDFieldComponent

    action: PasswordResetSessionComponentAction

    initialState: PasswordResetSessionComponentState = { type: "initial-reset-session" }

    content: {
        loginID: Content<LoginID>
    }

    constructor(
        loginID: LoginIDFieldComponent,
        action: PasswordResetSessionComponentAction,
    ) {
        this.loginID = loginID

        this.action = action

        this.content = {
            loginID: { input: { inputValue: "" }, valid: false },
        }

        this.loginID.onContentChange((content: Content<LoginID>) => {
            this.content.loginID = content
        })
    }

    async createSession(event: PasswordResetSessionComponentEvent): Promise<void> {
        const result = await this.action.passwordResetSession.createSession(event, [this.content.loginID])
        if (!result.success) {
            return
        }

        await this.action.passwordResetSession.startPollingStatus(event, result.session)
    }
}

class ComponentEvent implements PasswordResetSessionComponentEvent {
    stateChanged: PasswordResetSessionComponentStateHandler

    constructor(stateChanged: PasswordResetSessionComponentStateHandler) {
        this.stateChanged = stateChanged
    }

    tryToCreateSession(): void {
        this.stateChanged({ type: "try-to-create-session" })
    }
    delayedToCreateSession(): void {
        this.stateChanged({ type: "delayed-to-create-session" })
    }
    failedToCreateSession(content: InputContent, err: SessionError): void {
        this.stateChanged({ type: "failed-to-create-session", content, err })
    }

    tryToPollingStatus(): void {
        this.stateChanged({ type: "try-to-polling-status" })
    }
    retryToPollingStatus(status: PollingStatus): void {
        this.stateChanged({ type: "retry-to-polling-status", status })
    }
    failedToPollingStatus(err: PollingStatusError): void {
        this.stateChanged({ type: "failed-to-polling-status", err })
    }

    succeedToSendToken(status: DoneStatus): void {
        this.stateChanged({ type: "succeed-to-send-token", status })
    }
}
