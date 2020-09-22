import { LoginIDFieldState } from "../field/login_id/data"

import { Destination, PollingStatus, CreateSessionError, PollingStatusError, SendTokenError } from "../../password_reset/data"
import { LoginIDFieldOperation } from "../../field/login_id/data"

export type PasswordResetSessionState =
    Readonly<{ type: "initial-reset-session" }> |
    Readonly<{ type: "try-to-create-session" }> |
    Readonly<{ type: "delayed-to-create-session" }> |
    Readonly<{ type: "failed-to-create-session", err: CreateSessionError }> |
    Readonly<{ type: "try-to-polling-status" }> |
    Readonly<{ type: "retry-to-polling-status", dest: Destination, status: PollingStatus }> |
    Readonly<{ type: "failed-to-polling-status", err: PollingStatusError }> |
    Readonly<{ type: "failed-to-send-token", dest: Destination, err: SendTokenError }> |
    Readonly<{ type: "succeed-to-send-token", dest: Destination }>

export const initialPasswordResetSessionState: PasswordResetSessionState = { type: "initial-reset-session" }

export type PasswordResetSessionComponentOperation =
    Readonly<{ type: "create-session" }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }>

export type PasswordResetSessionWorkerState =
    Readonly<{ type: "password_login", state: PasswordResetSessionState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldState }>
