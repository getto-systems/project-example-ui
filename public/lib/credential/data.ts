export type AuthResource = Readonly<{
    ticketNonce: TicketNonce
    lastAuthAt: AuthAt
}>

export type AuthCredential = Readonly<{
    ticketNonce: TicketNonce,
    apiCredential: ApiCredential,
    authAt: AuthAt
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

export type RenewEvent =
    Readonly<{ type: "try-to-instant-load" }> |
    Readonly<{ type: "required-to-login" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "succeed-to-renew" }>

export type StoreEvent =
    Readonly<{ type: "failed-to-store", err: StoreError }>

export type FetchResponse =
    Readonly<{ success: false, err: FetchError }> |
    Readonly<{ success: true, found: false }> |
    Readonly<{ success: true, found: true, content: AuthResource }>

export type FetchError =
    Readonly<{ type: "infra-error", err: string }>

export type StoreError =
    Readonly<{ type: "infra-error", err: string }>

export type RenewError =
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
