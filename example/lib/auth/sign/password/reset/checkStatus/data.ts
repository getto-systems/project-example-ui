export type SendingStatus = Readonly<{ sending: boolean }>

export type CheckSendingStatusError = CheckSendingStatusRemoteError
export type CheckSendingStatusRemoteError =
    | Readonly<{ type: "empty-session-id" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "invalid-password-reset" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type SendTokenError = Readonly<{ type: "infra-error"; err: string }>
