export type TicketNonce = string & { TicketNonce: never }
export function markTicketNonce(nonce: string): TicketNonce {
    return nonce as TicketNonce
}

export type LoginAt = Date & { LoginAt: never }
export function markLoginAt(date: Date): LoginAt {
    return date as LoginAt
}

export type LastLogin = Readonly<{
    ticketNonce: TicketNonce
    lastLoginAt: LoginAt
}>

export type AuthCredential = Readonly<{
    ticketNonce: TicketNonce
    apiCredential: ApiCredential
    loginAt: LoginAt
}>

export type ApiCredential = ApiCredential_data & { ApiCredential: never }
type ApiCredential_data = Readonly<{
    // TODO ApiNonce を追加
    // apiNonce: string
    apiRoles: string[]
}>
export function markApiCredential(apiCredential: ApiCredential_data): ApiCredential {
    return apiCredential as ApiCredential
}

export type FindEvent =
    | Readonly<{ type: "failed-to-find"; err: StorageError }>
    | Readonly<{ type: "not-found" }>
    | Readonly<{ type: "succeed-to-find"; lastLogin: LastLogin }>

export type StoreEvent =
    | Readonly<{ type: "failed-to-store"; err: StorageError }>
    | Readonly<{ type: "succeed-to-store" }>

export type RemoveEvent =
    | Readonly<{ type: "failed-to-remove"; err: StorageError }>
    | Readonly<{ type: "succeed-to-remove" }>

export type StorageError = Readonly<{ type: "infra-error"; err: string }>
