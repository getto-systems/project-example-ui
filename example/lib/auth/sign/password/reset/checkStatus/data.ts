export type PasswordResetSendingStatus = Readonly<{ sending: boolean }>

export type CheckPasswordResetSendingStatusError = CheckPasswordResetSendingStatusRemoteError
export type CheckPasswordResetSendingStatusRemoteError =
    | Readonly<{ type: "empty-session-id" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type SendPasswordResetTokenError = Readonly<{ type: "infra-error"; err: string }>
