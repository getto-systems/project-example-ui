import { ApiCredentialRepository } from "../../../../common/apiCredential/infra"
import { Clock } from "../../../../z_infra/clock/infra"
import { DelayTime, IntervalTime } from "../../../../z_infra/time/infra"
import { AuthnInfoRepository, RenewAuthnInfoRemoteAccess } from "../common/infra"

import {
    ForceStartContinuousRenewAuthnInfoMethod,
    StartContinuousRenewAuthnInfoMethod,
} from "./method"

export type StartContinuousRenewAuthnInfoInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
    renew: RenewAuthnInfoRemoteAccess
    clock: Clock
    config: Readonly<{
        interval: IntervalTime
        delay: DelayTime // TODO delay 表示を出すまでの待ち時間、って感じの名前にしたい
    }>
}>

export interface StartContinuousRenewAuthnInfo {
    (infra: StartContinuousRenewAuthnInfoInfra): StartContinuousRenewAuthnInfoMethod
}
export interface ForceStartContinuousRenewAuthnInfo {
    (infra: StartContinuousRenewAuthnInfoInfra): ForceStartContinuousRenewAuthnInfoMethod
}
