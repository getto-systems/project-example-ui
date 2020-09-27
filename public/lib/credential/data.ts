export type AuthCredential = Readonly<{
    authAt: AuthAt
    ticketNonce: TicketNonce,
    apiCredential: ApiCredential,
}>

export type ApiCredential = Readonly<{
    // TODO api nonce を追加する
    //apiNonce: ApiNonce,
    apiRoles: ApiRoles,
}>

export type TicketNonce = { TicketNonce: never }

//export type ApiNonce = { ApiNonce: never }

export type ApiRoles = ApiRole[]
export type ApiRole = { ApiRole: never }

export type AuthAt = { AuthAt: never }

export type RenewRun =
    Readonly<{ immediately: false }> |
    Readonly<{ immediately: true, delay: DelayTime }>

type DelayTime = Readonly<{ delay_milli_second: number }>

export type RenewEvent =
    Readonly<{ type: "required-to-login" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "succeed-to-renew", authCredential: AuthCredential }> |
    Readonly<{ type: "succeed-to-renew-interval", authCredential: AuthCredential }>

export type RenewError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
