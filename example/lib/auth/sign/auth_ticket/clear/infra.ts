import { RemoteTypes } from "../../../../z_vendor/getto-application/infra/remote/infra"
import { AuthzRepositoryPod } from "../kernel/infra"
import { AuthnRepositoryPod } from "../kernel/infra"

import { AuthnNonce } from "../kernel/data"
import { ClearAuthTicketRemoteError } from "./data"

export type ClearAuthTicketInfra = Readonly<{
    authn: AuthnRepositoryPod
    authz: AuthzRepositoryPod
    clear: ClearAuthTicketRemotePod
}>

type ClearRemoteTypes = RemoteTypes<AuthnNonce, true, true, ClearAuthTicketRemoteError>
export type ClearAuthTicketRemotePod = ClearRemoteTypes["pod"]
export type ClearAuthTicketResult = ClearRemoteTypes["result"]
export type ClearAuthTicketSimulator = ClearRemoteTypes["simulator"]
