export type ResetTokenSendingResult =
    | Readonly<{ done: false; status: ResetTokenSendingStatus }>
    | Readonly<{ done: true; send: false; err: ResetTokenSendingError }>
    | Readonly<{ done: true; send: true }>

export type ResetTokenSendingStatus = Readonly<{ sending: boolean }>

export type ResetTokenSendingError = "failed-to-connect-message-service"

export type CheckResetTokenSendingStatusError = CheckResetTokenSendingStatusRemoteError
export type CheckResetTokenSendingStatusRemoteError =
    | Readonly<{ type: "empty-session-id" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "already-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type SendResetTokenError = Readonly<{ type: "infra-error"; err: string }>
