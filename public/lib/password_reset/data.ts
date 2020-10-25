import { AuthCredential } from "../credential/data"
import { LoginID } from "../login_id/data"
import { Password } from "../password/data"

export type SessionID = { SessionID: never }
export type ResetToken = { ResetToken: never }

// TODO log 以外にも対応 : というより、never にするべきかな
export type Destination = Readonly<{ type: "log" }>

export type PollingStatus = Readonly<{ sending: false }> | Readonly<{ sending: true }>

export type StartSessionFields = Readonly<{
    loginID: LoginID
}>

export type ResetFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type StartSessionEvent =
    | Readonly<{ type: "try-to-start-session" }>
    | Readonly<{ type: "delayed-to-start-session" }>
    | Readonly<{ type: "failed-to-start-session"; err: StartSessionError }>
    | Readonly<{ type: "succeed-to-start-session"; sessionID: SessionID }>

export type StartSessionError =
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type PollingStatusEvent =
    | Readonly<{ type: "try-to-polling-status" }>
    | Readonly<{ type: "retry-to-polling-status"; dest: Destination; status: PollingStatus }>
    | Readonly<{ type: "failed-to-polling-status"; err: PollingStatusError }>
    | Readonly<{ type: "failed-to-send-token"; dest: Destination; err: SendTokenError }>
    | Readonly<{ type: "succeed-to-send-token"; dest: Destination }>

export type PollingStatusError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type SendTokenError = Readonly<{ type: "infra-error"; err: string }>

export type ResetEvent =
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: ResetError }>
    | Readonly<{ type: "succeed-to-reset"; authCredential: AuthCredential }>

export type ResetError =
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
