import { RemoteTypes } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { RepositoryPod } from "../../../../../z_vendor/getto-application/infra/repository/infra"

import { RenewAuthInfoRemoteError, AuthnNonce, LastAuth, AuthInfo } from "./data"
import { AuthzRemoteValue } from "../../../../../common/authz/infra"

export type LastAuthRepositoryPod = RepositoryPod<LastAuth, LastAuthRepositoryValue>
export type LastAuthRepositoryValue = Readonly<{
    nonce: string
    lastAuthAt: string
}>

type RenewRemoteTypes = RemoteTypes<AuthnNonce, AuthInfo, AuthRemoteValue, RenewAuthInfoRemoteError>
export type RenewAuthInfoRemotePod = RenewRemoteTypes["pod"]
export type RenewAuthInfoResult = RenewRemoteTypes["result"]
export type RenewAuthInfoSimulator = RenewRemoteTypes["simulator"]

export type AuthRemoteValue = Readonly<{
    authn: Readonly<{ nonce: string }>
    authz: AuthzRemoteValue
}>
