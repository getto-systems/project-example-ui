import { LoginIDFieldComponentState } from "../field/login_id/data"

import {
    CreateSessionInputContent,
    CreateSessionError,
    PollingStatusError, PollingStatus, DoneStatus,
} from "../../password_reset/data"
import { LoginIDFieldOperation } from "../../field/login_id/data"

export type PasswordResetSessionComponentState =
    Readonly<{ type: "initial-reset-session" }> |
    Readonly<{ type: "try-to-create-session" }> |
    Readonly<{ type: "delayed-to-create-session" }> |
    Readonly<{ type: "failed-to-create-session", content: CreateSessionInputContent, err: CreateSessionError }> |
    Readonly<{ type: "try-to-polling-status" }> |
    Readonly<{ type: "retry-to-polling-status", status: PollingStatus }> |
    Readonly<{ type: "failed-to-polling-status", err: PollingStatusError }> |
    Readonly<{ type: "succeed-to-send-token", status: DoneStatus }>

export const initialPasswordResetSessionComponentState: PasswordResetSessionComponentState = { type: "initial-reset-session" }

export type PasswordResetSessionComponentOperation =
    Readonly<{ type: "create-session" }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }>

export type PasswordResetSessionWorkerComponentState =
    Readonly<{ type: "password_login", state: PasswordResetSessionComponentState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldComponentState }>
