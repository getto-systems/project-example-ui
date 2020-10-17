import { LoginIDFieldComponent } from "../field/login_id/component"

import { SessionAction } from "../../../password_reset/action"
import { LoginIDFieldAction } from "../../../login_id/field/action"

import { Destination, PollingStatus, StartSessionError, PollingStatusError, SendTokenError } from "../../../password_reset/data"

export interface PasswordResetSessionInit {
    (actions: PasswordResetSessionActionSet, components: PasswordResetSessionFieldComponentSet): PasswordResetSessionComponent
}
export type PasswordResetSessionActionSet = Readonly<{
    session: SessionAction
    field: {
        loginID: LoginIDFieldAction
    }
}>

export interface PasswordResetSessionComponent {
    onStateChange(post: Post<PasswordResetSessionState>): void
    action(request: PasswordResetSessionRequest): void
    readonly components: PasswordResetSessionFieldComponentSet
}
export type PasswordResetSessionFieldComponentSet = Readonly<{
    loginIDField: LoginIDFieldComponent
}>

export type PasswordResetSessionState =
    Readonly<{ type: "initial-reset-session" }> |
    Readonly<{ type: "try-to-start-session" }> |
    Readonly<{ type: "delayed-to-start-session" }> |
    Readonly<{ type: "failed-to-start-session", err: StartSessionError }> |
    Readonly<{ type: "try-to-polling-status" }> |
    Readonly<{ type: "retry-to-polling-status", dest: Destination, status: PollingStatus }> |
    Readonly<{ type: "failed-to-polling-status", err: PollingStatusError }> |
    Readonly<{ type: "failed-to-send-token", dest: Destination, err: SendTokenError }> |
    Readonly<{ type: "succeed-to-send-token", dest: Destination }> |
    Readonly<{ type: "error", err: string }>

export const initialPasswordResetSessionState: PasswordResetSessionState = { type: "initial-reset-session" }

export type PasswordResetSessionRequest =
    Readonly<{ type: "start-session" }>

interface Post<T> {
    (state: T): void
}
