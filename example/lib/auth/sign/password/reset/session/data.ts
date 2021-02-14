import { LoginID } from "../../../../../common/auth/loginID/data"

export type SessionID = string & { SessionID: never }
export function markSessionID(sessionID: string): SessionID {
    return sessionID as string & { SessionID: never }
}

// TODO log 以外にも対応 : というより、never にするべきかな
export type Destination = Readonly<{ type: "log" }>

export type SendingStatus = Readonly<{ sending: boolean }>

export type StartSessionFields = Readonly<{
    loginID: LoginID
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
