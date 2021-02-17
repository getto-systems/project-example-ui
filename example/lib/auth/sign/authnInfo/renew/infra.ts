import { Clock } from "../../../../z_infra/clock/infra"
import { Delayed } from "../../../../z_infra/delayed/infra"
import { DelayTime, ExpireTime } from "../../../../z_infra/time/infra"
import { ApiCredentialRepository } from "../../../../common/apiCredential/infra"
import { AuthnInfoRepository, RenewAuthnInfoRemote } from "../common/infra"

export type RenewAuthnInfoInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
    renew: RenewAuthnInfoRemote
    clock: Clock
    delayed: Delayed
    config: Readonly<{
        instantLoadExpire: ExpireTime
        delay: DelayTime
    }>
}>
