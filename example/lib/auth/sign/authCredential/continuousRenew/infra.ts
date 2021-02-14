import { ApiCredentialRepository } from "../../../../common/apiCredential/infra"
import { Clock } from "../../../../z_infra/clock/infra"
import { DelayTime, IntervalTime } from "../../../../z_infra/time/infra"
import { AuthCredentialRepository, RenewRemoteAccess } from "../common/infra"

import { ForceStartPod, StartPod } from "./action"

export type ContinuousRenewActionInfra = StartInfra

export type StartInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authCredentials: AuthCredentialRepository
    config: StartConfig
    renew: RenewRemoteAccess
    clock: Clock
}>
export type StartConfig = Readonly<{
    interval: IntervalTime
    delay: DelayTime // TODO delay 表示を出すまでの待ち時間、って感じの名前にしたい
}>

export interface Start {
    (infra: StartInfra): StartPod
}
export interface ForceStart {
    (infra: StartInfra): ForceStartPod
}
