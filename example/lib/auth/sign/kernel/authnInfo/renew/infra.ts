import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import { DelayedChecker } from "../../../../../z_vendor/getto-application/infra/timer/infra"
import { DelayTime, ExpireTime } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { ApiCredentialRepository } from "../../../../../common/apiCredential/infra"
import { AuthnInfoRepository, RenewRemote } from "../kernel/infra"

export type RenewInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
    renew: RenewRemote
    clock: Clock
    delayed: DelayedChecker
    config: Readonly<{
        instantLoadExpire: ExpireTime
        delay: DelayTime
    }>
}>
