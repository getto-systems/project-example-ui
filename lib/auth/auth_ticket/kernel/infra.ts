import { RemoteTypes } from "../../../z_vendor/getto-application/infra/remote/infra"
import { RepositoryPod_legacy } from "../../../z_vendor/getto-application/infra/repository/infra"

import { AuthTicket, Authn, Authz, RenewAuthTicketRemoteError } from "./data"

export type AuthnRepositoryPod = RepositoryPod_legacy<Authn, AuthnRepositoryValue>
export type AuthnRepositoryValue = Readonly<{
    authAt: string
}>

export type AuthzRepositoryPod = RepositoryPod_legacy<Authz, AuthzRepositoryValue>
export type AuthzRepositoryValue = Readonly<{
    roles: string[]
}>

type RenewRemoteTypes = RemoteTypes<
    { type: "always" }, // 引数は必要ないが、null を使うのは嫌なのでこうしておく
    AuthTicket,
    AuthRemoteValue,
    RenewAuthTicketRemoteError
>
export type RenewAuthTicketRemotePod = RenewRemoteTypes["pod"]
export type RenewAuthTicketResult = RenewRemoteTypes["result"]
export type RenewAuthTicketSimulator = RenewRemoteTypes["simulator"]

export type AuthRemoteValue = Readonly<{
    roles: string[]
}>
