import { InputValue } from "../input/data"

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

// TODO invalid-password-reset -> invalid-password-reset-session
export type SessionError =
    Readonly<{ type: "validation-error" }> |
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>

// TODO invalid-password-reset -> invalid-password-reset-session
export type PollingStatusError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-password-reset" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
