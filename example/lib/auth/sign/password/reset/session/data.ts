import { LoginID } from "../../../../common/loginID/data"

export type PasswordResetSessionID = string & { PasswordResetSessionID: never }
export function markPasswordResetSessionID(sessionID: string): PasswordResetSessionID {
    return sessionID as PasswordResetSessionID
}

// TODO log 以外にも対応 : というより、never にするべきかな
export type PasswordResetDestination = Readonly<{ type: "log" }>

export type PasswordResetSendingStatus = Readonly<{ sending: boolean }>

export type PasswordResetSessionFields = Readonly<{
    loginID: LoginID
}>

export type StartPasswordResetSessionError =
    | Readonly<{ type: "validation-error" }>
    | StartPasswordResetSessionRemoteError

export type StartPasswordResetSessionRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type CheckPasswordResetSessionStatusError = CheckPasswordResetSessionStatusRemoteError
export type CheckPasswordResetSessionStatusRemoteError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type SendPasswordResetSessionTokenError = Readonly<{ type: "infra-error"; err: string }>
