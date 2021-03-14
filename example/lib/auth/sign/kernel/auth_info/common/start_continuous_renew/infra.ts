import { AuthzRepositoryPod } from "../../kernel/infra"
import { Clock } from "../../../../../../z_vendor/getto-application/infra/clock/infra"
import {
    ExpireTime,
    IntervalTime,
} from "../../../../../../z_vendor/getto-application/infra/config/infra"
import { LastAuthRepositoryPod, RenewAuthInfoRemotePod } from "../../kernel/infra"

export type StartContinuousRenewInfra = Readonly<{
    lastAuth: LastAuthRepositoryPod
    authz: AuthzRepositoryPod
    renew: RenewAuthInfoRemotePod
    clock: Clock
    config: Readonly<{
        interval: IntervalTime
        lastAuthExpire: ExpireTime
    }>
}>
