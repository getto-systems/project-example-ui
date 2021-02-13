export type AuthCredential = Readonly<{
    ticketNonce: TicketNonce
    authAt: AuthAt
}>

export type LastLogin = Readonly<{
    ticketNonce: TicketNonce
    lastAuthAt: AuthAt
}>

export type TicketNonce = string & { TicketNonce: never }
export function markTicketNonce(nonce: string): TicketNonce {
    return nonce as TicketNonce
}

export type AuthAt = Date & { AuthAt: never }
export function markAuthAt(date: Date): AuthAt {
    return date as AuthAt
}
export function hasExpired(authAt: AuthAt, target: { now: Date; expire_millisecond: number }): boolean {
    return target.now.getTime() > authAt.getTime() + target.expire_millisecond
}

export type StoreAuthCredential =
    | Readonly<{ store: false }>
    | Readonly<{ store: true; authCredential: AuthCredential }>
export const emptyAuthCredential: StoreAuthCredential = { store: false }
export function storeAuthCredential(authCredential: AuthCredential): StoreAuthCredential {
    return { store: true, authCredential }
}

export type RenewError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type RenewRemoteError = RenewError | Readonly<{ type: "invalid-ticket" }>
