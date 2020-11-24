export type TicketNonce = string & { TicketNonce: never }
export function markTicketNonce(nonce: string): TicketNonce {
    return nonce as TicketNonce
}

export type AuthAt = Date & { AuthAt: never }
export function markAuthAt(date: Date): AuthAt {
    return date as AuthAt
}

export type LastAuth = Readonly<{
    ticketNonce: TicketNonce
    lastAuthAt: AuthAt
}>

export type AuthCredential = Readonly<{
    ticketNonce: TicketNonce
    apiCredential: ApiCredential
    authAt: AuthAt
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

export type RenewEvent =
    | Readonly<{ type: "try-to-instant-load" }>
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "succeed-to-renew" }>

export type SetContinuousRenewEvent =
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "storage-error"; err: StorageError }>

export type StoreEvent = Readonly<{ type: "storage-error"; err: StorageError }>

export type FoundLastAuth =
    | Readonly<{ success: false; err: StorageError }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: true; found: true; content: LastAuth }>

export type StorageError = Readonly<{ type: "infra-error"; err: string }>

export type RenewError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>
