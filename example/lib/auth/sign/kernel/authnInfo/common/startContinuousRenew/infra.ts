import { ApiCredentialRepository } from "../../../../../../common/apiCredential/infra"
import { Clock } from "../../../../../../z_vendor/getto-application/infra/clock/infra"
import { DelayTime, IntervalTime } from "../../../../../../z_vendor/getto-application/infra/config/infra"
import { AuthnInfoRepository, RenewRemote } from "../../kernel/infra"

export type StartContinuousRenewInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
    renew: RenewRemote
    clock: Clock
    config: Readonly<{
        interval: IntervalTime
        delay: DelayTime // TODO delay 表示を出すまでの待ち時間、って感じの名前にしたい
    }>
}>
