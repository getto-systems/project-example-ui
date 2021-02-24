export type AuthnInfo = Readonly<{
    authnNonce: AuthnNonce
    authAt: AuthAt
}>

export type LastAuth = Readonly<{
    authnNonce: AuthnNonce
    lastAuthAt: AuthAt
}>

export type AuthnNonce = string & { AuthnNonce: never }
export function markAuthnNonce(nonce: string): AuthnNonce {
    return nonce as AuthnNonce
}

export type AuthAt = Date & { AuthAt: never }
export function markAuthAt(date: Date): AuthAt {
    return date as AuthAt
}
export function hasExpired(
    authAt: AuthAt,
    target: { now: Date; expire_millisecond: number },
): boolean {
    return target.now.getTime() > authAt.getTime() + target.expire_millisecond
}

export type RenewError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type RenewRemoteError = RenewError | Readonly<{ type: "invalid-ticket" }>
