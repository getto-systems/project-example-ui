import { ApiCredentialRepository } from "../../../../common/apiCredential/infra"
import { Clock } from "../../../../z_infra/clock/infra"
import { DelayTime, IntervalTime } from "../../../../z_infra/time/infra"
import { AuthCredentialRepository, RenewAuthCredentialRemoteAccess } from "../common/infra"

import {
    ForceStartContinuousRenewAuthCredentialMethod,
    StartContinuousRenewAuthCredentialMethod,
} from "./action"

export type StartContinuousRenewAuthCredentialActionInfra = StartContinuousRenewAuthCredentialInfra

export type StartContinuousRenewAuthCredentialInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authCredentials: AuthCredentialRepository
    renew: RenewAuthCredentialRemoteAccess
    clock: Clock
    config: Readonly<{
        interval: IntervalTime
        delay: DelayTime // TODO delay 表示を出すまでの待ち時間、って感じの名前にしたい
    }>
}>

export interface StartContinuousRenewAuthCredential {
    (infra: StartContinuousRenewAuthCredentialInfra): StartContinuousRenewAuthCredentialMethod
}
export interface ForceStartContinuousRenewAuthCredential {
    (infra: StartContinuousRenewAuthCredentialInfra): ForceStartContinuousRenewAuthCredentialMethod
}
