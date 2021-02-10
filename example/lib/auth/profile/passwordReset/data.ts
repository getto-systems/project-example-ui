import { LoginID } from "../../common/loginID/data"
import { Password } from "../../common/password/data"

export type SessionID = string & { SessionID: never }
export function markSessionID(sessionID: string): SessionID {
    return sessionID as string & { SessionID: never }
}

export type ResetToken = string & { ResetToken: never }
export function markResetToken(resetToken: string): ResetToken {
    return resetToken as string & { ResetToken: never }
}

// TODO log 以外にも対応 : というより、never にするべきかな
export type Destination = Readonly<{ type: "log" }>

export type SendingStatus = Readonly<{ sending: boolean }>

export type StartSessionFields = Readonly<{
    loginID: LoginID
}>

export type ResetFields = Readonly<{
    loginID: LoginID
    password: Password
}>

export type StartSessionError = Readonly<{ type: "validation-error" }> | StartSessionRemoteError
export type StartSessionRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type CheckStatusError = CheckStatusRemoteError
export type CheckStatusRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type SendTokenError = Readonly<{ type: "infra-error"; err: string }>

export type ResetError =
    | Readonly<{ type: "validation-error" }>
    | Readonly<{ type: "empty-reset-token" }>
    | ResetRemoteError

export type ResetRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
