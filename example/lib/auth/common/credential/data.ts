export type TicketNonce = string & { TicketNonce: never }
export function markTicketNonce(nonce: string): TicketNonce {
    return nonce as TicketNonce
}

export type AuthAt = Date & { AuthAt: never }
export function markAuthAt(date: Date): AuthAt {
    return date as AuthAt
}
export function hasExpired(
    authAt: AuthAt,
    target: { now: Date; expire_millisecond: number }
): boolean {
    return target.now.getTime() > authAt.getTime() + target.expire_millisecond
}

export type LastLogin = Readonly<{
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

export type StorageError = Readonly<{ type: "infra-error"; err: string }>

export type ApiNonce = string & { ApiNonce: never }
export function markApiNonce(nonce: string): ApiNonce {
    return nonce as ApiNonce
}

export type ApiRoles = string[] & { ApiRoles: never }
export function markApiRoles(roles: string[]): ApiRoles {
    return roles as ApiRoles
}

// TODO found: boolean にしたほうがよくない？
export type LoadResult<T> =
    | Readonly<{ success: false; err: LoadApiCredentialError }>
    | Readonly<{ success: true; content: T }>

export type LoadApiCredentialError =
    | Readonly<{ type: "not-found" }>
    | Readonly<{ type: "infra-error"; err: string }>
