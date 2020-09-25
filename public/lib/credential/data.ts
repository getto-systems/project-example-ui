export type AuthCredential = Readonly<{
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

export type RenewEvent =
    Readonly<{ type: "required-to-login" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "succeed-to-renew", authCredential: AuthCredential }>

export type RenewError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>

export type StoreEvent =
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "succeed-to-store" }>

export type StoreError =
    Readonly<{ type: "infra-error", err: string }>
