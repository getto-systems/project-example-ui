import { Clock } from "../../../../../z_getto/infra/clock/infra"
import { Delayed } from "../../../../../z_getto/infra/delayed/infra"
import { DelayTime, ExpireTime } from "../../../../../z_getto/infra/config/infra"
import { ApiCredentialRepository } from "../../../../../common/apiCredential/infra"
import { AuthnInfoRepository, RenewRemote } from "../kernel/infra"

export type RenewInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
    renew: RenewRemote
    clock: Clock
    delayed: Delayed
    config: Readonly<{
        instantLoadExpire: ExpireTime
        delay: DelayTime
    }>
}>
