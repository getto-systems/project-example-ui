import { InputValue } from "../field/data"

export type InputContent = Readonly<{
    loginID: InputValue,
}>

export type Session = Readonly<{ sessionID: Readonly<string> }>

// TODO log 以外にも対応
export type Destination =
    Readonly<{ type: "log" }>

// TODO since と at を時間型にしたい
export type PollingStatus =
    Readonly<{ sending: false, since: string }> |
    Readonly<{ sending: true, since: string }>

export type DoneStatus =
    Readonly<{ success: true, at: string }> |
    Readonly<{ success: false, at: string }>

export type CreateSessionEvent =
    Readonly<{ type: "try-to-create-session" }> |
    Readonly<{ type: "delayed-to-create-session" }> |
    Readonly<{ type: "failed-to-create-session", content: InputContent, err: CreateSessionError }> |
    Readonly<{ type: "succeed-to-create-session", session: Session }>

// TODO invalid-password-reset -> invalid-password-reset-session
export type CreateSessionError =
    Readonly<{ type: "validation-error" }> |
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>

export type PollingStatusEvent =
    Readonly<{ type: "try-to-polling-status" }> |
    Readonly<{ type: "retry-to-polling-status", status: PollingStatus }> |
    Readonly<{ type: "failed-to-polling-status", err: PollingStatusError }> |
    Readonly<{ type: "succeed-to-send-token", status: DoneStatus }>

// TODO invalid-password-reset -> invalid-password-reset-session
export type PollingStatusError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
