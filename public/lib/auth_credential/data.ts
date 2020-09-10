export type LoginID = Readonly<{ loginID: Readonly<string> }>
export type LoginIDError = "empty";

export type AuthCredential = Readonly<{
    ticketNonce: TicketNonce,
    apiCredential: ApiCredential,
}>

export type TicketNonce = Readonly<{ ticketNonce: Readonly<string> }>

export type ApiCredential = Readonly<{
    // TODO api nonce を追加する
    //apiNonce: ApiNonce,
    apiRoles: ApiRoles,
}>
//export type ApiNonce = Readonly<{ apiNonce: Readonly<string> }>
export type ApiRoles = Readonly<{ apiRoles: Readonly<Array<Readonly<string>>> }>

export type RenewError =
    Readonly<{ type: "empty-nonce" }> |
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-ticket" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>

export type StoreError =
    Readonly<{ type: "infra-error", err: string }>
