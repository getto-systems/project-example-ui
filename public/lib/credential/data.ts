export type TicketNonce = Readonly<_TicketNonce>

export function initTicketNonce(ticketNonce: string): TicketNonce {
    return ticketNonce as _TicketNonce
}

export function ticketNonceToString(ticketNonce: TicketNonce): Readonly<string> {
    return `${ticketNonce}`
}

type _TicketNonce = string & { TicketNonce: never }

//export type ApiNonce = Readonly<{ apiNonce: Readonly<string> }>

export type ApiRoles = Readonly<Array<Readonly<_ApiRole>>>

export function initApiRoles(apiRoles: Array<string>): ApiRoles {
    return apiRoles.map((apiRole) => apiRole as _ApiRole)
}

type _ApiRole = string & { ApiRole: never }

export type AuthCredential = Readonly<{
    ticketNonce: TicketNonce,
    apiCredential: ApiCredential,
}>
export type AuthCredentialSerialized = Readonly<{
    ticketNonce: string,
    apiCredential: {
        apiRoles: Array<string>
    },
}>

export function serializeAuthCredential(authCredential: AuthCredential): AuthCredentialSerialized {
    return {
        ticketNonce: ticketNonceToString(authCredential.ticketNonce),
        apiCredential: {
            apiRoles: authCredential.apiCredential.apiRoles.map((apiRole) => `${apiRole}`),
        },
    }
}

export type ApiCredential = Readonly<{
    // TODO api nonce を追加する
    //apiNonce: ApiNonce,
    apiRoles: ApiRoles,
}>

export type FetchEvent =
    Readonly<{ type: "failed-to-fetch", err: FetchError }> |
    Readonly<{ type: "unauthorized" }> |
    Readonly<{ type: "succeed-to-fetch", ticketNonce: TicketNonce }>

export type FetchError =
    Readonly<{ type: "infra-error", err: string }>

export type RenewEvent =
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "unauthorized" }> |
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
