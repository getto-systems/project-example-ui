import { AuthzRepository } from "../../../../../common/authz/infra"
import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import { DelayTime, ExpireTime } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { AuthnInfoRepository, RenewRemote } from "../kernel/infra"

export type RenewInfra = Readonly<{
    authz: AuthzRepository
    authnInfos: AuthnInfoRepository
    renew: RenewRemote
    clock: Clock
    config: Readonly<{
        instantLoadExpire: ExpireTime
        delay: DelayTime
    }>
}>
