import { Authz } from "../../../../common/authz/data"

export type AuthInfo = Readonly<{
    authn: Authn
    authz: Authz
}>

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
export type AuthAt = Date & { AuthAt: never }

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
