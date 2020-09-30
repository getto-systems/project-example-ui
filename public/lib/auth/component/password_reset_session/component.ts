import { LoginIDFieldState } from "../field/login_id/component"

import { Destination, PollingStatus, StartSessionError, PollingStatusError, SendTokenError } from "../../../password_reset/data"
import { LoginIDFieldOperation } from "../../../login_id/field/data"

export interface PasswordResetSessionComponent {
    onStateChange(stateChanged: Post<PasswordResetSessionState>): void
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void
    init(): PasswordResetSessionComponentResource
}
export type PasswordResetSessionComponentResource = ComponentResource<PasswordResetSessionOperation>

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

export type PasswordResetSessionOperation =
    Readonly<{ type: "start-session" }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }>

export const initialPasswordResetSessionRequest: Post<PasswordResetSessionOperation> = () => {
    throw new Error("Component is not initialized. use: `init()`")
}

export interface PasswordResetSessionWorkerComponentHelper {
    mapPasswordResetSessionState(state: PasswordResetSessionState): PasswordResetSessionWorkerState
    mapLoginIDFieldState(state: LoginIDFieldState): PasswordResetSessionWorkerState
}

export type PasswordResetSessionWorkerState =
    Readonly<{ type: "password_reset_session", state: PasswordResetSessionState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldState }>

interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}

type ComponentResource<T> = Readonly<{
    request: Post<T>
    terminate: Terminate
}>
