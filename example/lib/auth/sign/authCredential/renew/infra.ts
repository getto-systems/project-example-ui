import { Clock } from "../../../../z_infra/clock/infra"
import { Delayed } from "../../../../z_infra/delayed/infra"
import { DelayTime, ExpireTime } from "../../../../z_infra/time/infra"
import { ApiCredentialRepository } from "../../../../common/auth/apiCredential/infra"
import { AuthCredentialRepository, RenewRemoteAccess } from "../common/infra"

import { ForceRequestPod, RequestPod } from "./action"

export type RenewActionInfra = RequestInfra

export type RequestInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authCredentials: AuthCredentialRepository
    config: RequestConfig
    renew: RenewRemoteAccess
    clock: Clock
    delayed: Delayed
}>
export type RequestConfig = Readonly<{
    instantLoadExpire: ExpireTime
    delay: DelayTime
}>

export interface Request {
    (infra: RequestInfra): RequestPod
}
export interface ForceRequest {
    (infra: RequestInfra): ForceRequestPod
}
