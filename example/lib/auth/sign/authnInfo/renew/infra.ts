import { Clock } from "../../../../z_infra/clock/infra"
import { Delayed } from "../../../../z_infra/delayed/infra"
import { DelayTime, ExpireTime } from "../../../../z_infra/time/infra"
import { ApiCredentialRepository } from "../../../../common/apiCredential/infra"
import { AuthnInfoRepository, RenewAuthnInfoRemoteAccess } from "../common/infra"

import { ForceRenewAuthnInfoMethod, RenewAuthnInfoMethod } from "./action"

export type RenewAuthnInfoActionInfra_legacy = RenewAuthnInfoInfra

export type RenewAuthnInfoInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
    renew: RenewAuthnInfoRemoteAccess
    clock: Clock
    delayed: Delayed
    config: Readonly<{
        instantLoadExpire: ExpireTime
        delay: DelayTime
    }>
}>

export interface RenewAuthnInfo {
    (infra: RenewAuthnInfoInfra): RenewAuthnInfoMethod
}
export interface ForceRenewAuthnInfo {
    (infra: RenewAuthnInfoInfra): ForceRenewAuthnInfoMethod
}
