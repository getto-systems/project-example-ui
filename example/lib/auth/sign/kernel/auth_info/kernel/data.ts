export type AuthInfo = Readonly<{
    authn: Authn
    authz: Authz
}>

export type Authn = Readonly<{
    nonce: AuthnNonce
    authAt: AuthAt
}>

export type AuthnNonce = string & { AuthnNonce: never }
export type AuthAt = Date & { AuthAt: never }

export type Authz = Readonly<{
    nonce: AuthzNonce
    roles: AuthzRoles
}>

export type AuthzNonce = string & { AuthzNonce: never }
export type AuthzRoles = string[] & { AuthzRoles: never }

export function hasExpired(
    authAt: AuthAt,
    target: { now: Date; expire_millisecond: number },
): boolean {
    return target.now.getTime() > authAt.getTime() + target.expire_millisecond
}

export type RenewAuthInfoError =
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export type RenewAuthInfoRemoteError = RenewAuthInfoError | Readonly<{ type: "invalid-ticket" }>
