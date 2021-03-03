import { AuthzRepositoryPod } from "../../../../../common/authz/infra"
import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import { DelayTime, ExpireTime } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { LastAuthRepositoryPod, RenewRemotePod } from "../kernel/infra"

export type CheckAuthInfoInfra = Readonly<{
    authz: AuthzRepositoryPod
    lastAuth: LastAuthRepositoryPod
    renew: RenewRemotePod
    clock: Clock
    config: Readonly<{
        instantLoadExpire: ExpireTime
        delay: DelayTime
    }>
}>
