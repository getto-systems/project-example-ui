import { LoginIDFieldComponent, initLoginIDField } from "./field/login_id";

import { AuthAction } from "../auth/action";
import { SessionEvent, PollingStatusEvent } from "../password_reset_session/action";

import {
    InputContent,
    SessionError,
    PollingStatusError, PollingStatus, DoneStatus,
} from "../password_reset_session/data";

export interface PasswordResetSessionComponent {
    fields(): PasswordResetSessionFieldComponents

    initialState(): ResetSessionState
    onStateChange(stateChanged: ResetSessionEventHandler): void

    createSession(): Promise<void>
}

export type PasswordResetSessionFieldComponents = [LoginIDFieldComponent]

export type ResetSessionState =
    Readonly<{ type: "initial-reset-session" }> |
    Readonly<{ type: "try-to-create-session" }> |
    Readonly<{ type: "delayed-to-create-session" }> |
    Readonly<{ type: "failed-to-create-session", content: InputContent, err: SessionError }> |
    Readonly<{ type: "try-to-polling-status" }> |
    Readonly<{ type: "retry-to-polling-status", status: PollingStatus }> |
    Readonly<{ type: "failed-to-polling-status", err: PollingStatusError }> |
    Readonly<{ type: "succeed-to-send-token", status: DoneStatus }>

export interface ResetSessionEventHandler {
    (state: ResetSessionState): void
}

export function initPasswordResetSession(action: AuthAction): PasswordResetSessionComponent {
    return new Component(action);
}

class Component implements PasswordResetSessionComponent {
    loginID: LoginIDFieldComponent

    action: AuthAction
    eventHolder: EventHolder<ComponentEvent>

    constructor(action: AuthAction) {
        this.action = action;
        this.eventHolder = { hasEvent: false }

        this.loginID = initLoginIDField(this.action);
    }

    fields(): PasswordResetSessionFieldComponents {
        return [this.loginID]
    }

    initialState(): ResetSessionState {
        return { type: "initial-reset-session" };
    }

    onStateChange(stateChanged: ResetSessionEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new ComponentEvent(stateChanged) }
    }
    event(): ComponentEvent {
        return unwrap(this.eventHolder);
    }

    async createSession(): Promise<void> {
        const result = await this.action.passwordResetSession.createSession(this.event(), [await this.loginID.validate()]);
        if (!result.success) {
            return;
        }

        await this.action.passwordResetSession.startPollingStatus(this.event(), result.session);
    }
}

class ComponentEvent implements SessionEvent, PollingStatusEvent {
    stateChanged: ResetSessionEventHandler

    constructor(stateChanged: ResetSessionEventHandler) {
        this.stateChanged = stateChanged;
    }

    tryToCreateSession(): void {
        this.stateChanged({ type: "try-to-create-session" });
    }
    delayedToCreateSession(): void {
        this.stateChanged({ type: "delayed-to-create-session" });
    }
    failedToCreateSession(content: InputContent, err: SessionError): void {
        this.stateChanged({ type: "failed-to-create-session", content, err });
    }

    tryToPollingStatus(): void {
        this.stateChanged({ type: "try-to-polling-status" });
    }
    retryToPollingStatus(status: PollingStatus): void {
        this.stateChanged({ type: "retry-to-polling-status", status });
    }
    failedToPollingStatus(err: PollingStatusError): void {
        this.stateChanged({ type: "failed-to-polling-status", err });
    }

    succeedToSendToken(status: DoneStatus): void {
        this.stateChanged({ type: "succeed-to-send-token", status });
    }
}

type EventHolder<T> =
    Readonly<{ hasEvent: false }> |
    Readonly<{ hasEvent: true, event: T }>
function unwrap<T>(holder: EventHolder<T>): T {
    if (!holder.hasEvent) {
        throw new Error("event is not initialized");
    }
    return holder.event;
}
