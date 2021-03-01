export type Authn = Readonly<{
    nonce: AuthnNonce
    authAt: AuthAt
}>
export type LastAuth = Readonly<{
    nonce: AuthnNonce
    lastAuthAt: AuthAt
}>
export function toLastAuth(info: Authn): LastAuth {
    return {
        nonce: info.nonce,
        lastAuthAt: info.authAt,
    }
}

export type AuthnNonce = string & { AuthnNonce: never }
export function markAuthnNonce_legacy(nonce: string): AuthnNonce {
    return nonce as AuthnNonce
}

export type AuthAt = Date & { AuthAt: never }
export function markAuthAt_legacy(date: Date): AuthAt {
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
