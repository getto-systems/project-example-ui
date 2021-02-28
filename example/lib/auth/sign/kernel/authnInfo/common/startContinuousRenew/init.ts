import { newAuthzRepository } from "../../../../../../common/authz/infra/repository/authz"
import { newAuthnInfoRepository } from "../../kernel/infra/repository/authnInfo/init"
import { newRenewAuthnInfoRemote } from "../../kernel/infra/remote/renew/init"

import { newClock } from "../../../../../../z_vendor/getto-application/infra/clock/init"

import { delayMinute, intervalMinute } from "../../../../../../z_vendor/getto-application/infra/config/infra"

import { StartContinuousRenewInfra } from "./infra"

export function newStartContinuousRenewAuthnInfoInfra(
    webStorage: Storage
): StartContinuousRenewInfra {
    return {
        authz: newAuthzRepository(webStorage),
        authnInfos: newAuthnInfoRepository(webStorage),
        renew: newRenewAuthnInfoRemote(),
        clock: newClock(),
        config: {
            delay: delayMinute(1),
            interval: intervalMinute(2),
        },
    }
}
