import { RemoteTypes } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { RepositoryPod } from "../../../../../z_vendor/getto-application/infra/repository/infra"

import { Authz } from "../../../../../common/authz/data"
import { Authn, RenewRemoteError, AuthnNonce, LastAuth } from "./data"
import { AuthzRemoteValue } from "../../../../../common/authz/infra"

export type LastAuthRepositoryPod = RepositoryPod<LastAuth, LastAuthRepositoryValue>
export type LastAuthRepositoryValue = Readonly<{
    nonce: string
    lastAuthAt: string
}>

type RenewTypes = RemoteTypes<AuthnNonce, RenewResponse, RenewRemoteValue, RenewRemoteError>

export type RenewRemotePod = RenewTypes["pod"]
export type RenewResult = RenewTypes["result"]
export type RenewSimulator = RenewTypes["simulator"]

export type RenewRemoteValue = Readonly<{
    authn: Readonly<{ nonce: string }>
    authz: AuthzRemoteValue
}>
export type RenewResponse = Readonly<{
    authn: Authn
    authz: Authz
}>
