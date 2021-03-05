import { AuthzRepositoryPod } from "../../../../../common/authz/infra"
import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import { DelayTime, ExpireTime } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { LastAuthRepositoryPod, RenewAuthInfoRemotePod } from "../kernel/infra"

export type CheckAuthInfoInfra = Readonly<{
    authz: AuthzRepositoryPod
    lastAuth: LastAuthRepositoryPod
    renew: RenewAuthInfoRemotePod
    clock: Clock
    config: Readonly<{
        instantLoadExpire: ExpireTime
        takeLongTimeThreshold: DelayTime
    }>
}>
