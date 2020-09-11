import { LoginIDFieldComponent } from "../../field/login_id/action"

import {
    PasswordResetSessionComponentAction,
    PasswordResetSessionComponent,
    PasswordResetSessionComponentEvent,
    PasswordResetSessionComponentState,
    PasswordResetSessionComponentStateHandler,
} from "../action"

import {
    InputContent,
    SessionError,
    PollingStatusError, PollingStatus, DoneStatus,
} from "../../../password_reset_session/data"

export function initPasswordResetSession(loginID: LoginIDFieldComponent, action: PasswordResetSessionComponentAction): PasswordResetSessionComponent {
    return new Component(loginID, action)
}

class Component implements PasswordResetSessionComponent {
    loginID: LoginIDFieldComponent

    action: PasswordResetSessionComponentAction
    eventHolder: EventHolder<ComponentEvent>

    initialState: PasswordResetSessionComponentState = { type: "initial-reset-session" }

    constructor(loginID: LoginIDFieldComponent, action: PasswordResetSessionComponentAction) {
        this.action = action
        this.eventHolder = { hasEvent: false }

        this.loginID = loginID
    }

    onStateChange(stateChanged: PasswordResetSessionComponentStateHandler): void {
        this.eventHolder = { hasEvent: true, event: new ComponentEvent(stateChanged) }
    }
    event(): ComponentEvent {
        return unwrap(this.eventHolder)
    }

    async createSession(): Promise<void> {
        const result = await this.action.passwordResetSession.createSession(this.event(), [await this.loginID.validate()])
        if (!result.success) {
            return
        }

        await this.action.passwordResetSession.startPollingStatus(this.event(), result.session)
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

type EventHolder<T> =
    Readonly<{ hasEvent: false }> |
    Readonly<{ hasEvent: true, event: T }>
function unwrap<T>(holder: EventHolder<T>): T {
    if (!holder.hasEvent) {
        throw new Error("event is not initialized")
    }
    return holder.event
}
