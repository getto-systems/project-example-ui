// TODO login_id に移動したい
export type LoginID = Readonly<{ loginID: Readonly<string> }>

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

export type FetchEvent =
    Readonly<{ type: "failed-to-fetch", err: FetchError }> |
    Readonly<{ type: "unauthorized" }> |
    Readonly<{ type: "succeed-to-fetch", ticketNonce: TicketNonce }>

export type FetchError =
    Readonly<{ type: "infra-error", err: string }>

export type StoreEvent =
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "succeed-to-store" }>

export type StoreError =
    Readonly<{ type: "infra-error", err: string }>
