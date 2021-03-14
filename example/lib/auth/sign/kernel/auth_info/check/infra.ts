import { AuthzRepositoryPod } from "../kernel/infra"
import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import { DelayTime, ExpireTime } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { AuthnRepositoryPod, RenewAuthInfoRemotePod } from "../kernel/infra"

export type CheckAuthInfoInfra = Readonly<{
    authz: AuthzRepositoryPod
    authn: AuthnRepositoryPod
    renew: RenewAuthInfoRemotePod
    clock: Clock
    config: Readonly<{
        instantLoadExpire: ExpireTime
        takeLongtimeThreshold: DelayTime
    }>
}>
