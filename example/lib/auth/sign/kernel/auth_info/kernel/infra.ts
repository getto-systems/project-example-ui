import { RemoteTypes } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { RepositoryPod } from "../../../../../z_vendor/getto-application/infra/repository/infra"
import { AuthInfo, Authn, AuthnNonce, Authz, RenewAuthInfoRemoteError } from "./data"

export type AuthnRepositoryPod = RepositoryPod<Authn, AuthnRepositoryValue>
export type AuthnRepositoryValue = Readonly<{
    nonce: string
    authAt: string
}>

export type AuthzRepositoryPod = RepositoryPod<Authz, AuthzRepositoryValue>
export type AuthzRepositoryValue = Readonly<{
    nonce: string
    roles: string[]
}>
export type AuthzRemoteValue = Readonly<{
    nonce: string
    roles: string[]
}>

type RenewRemoteTypes = RemoteTypes<AuthnNonce, AuthInfo, AuthRemoteValue, RenewAuthInfoRemoteError>
export type RenewAuthInfoRemotePod = RenewRemoteTypes["pod"]
export type RenewAuthInfoResult = RenewRemoteTypes["result"]
export type RenewAuthInfoSimulator = RenewRemoteTypes["simulator"]

export type AuthRemoteValue = Readonly<{
    authn: Readonly<{ nonce: string }>
    authz: AuthzRemoteValue
}>
