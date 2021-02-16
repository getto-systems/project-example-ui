import { initSimulateRemoteAccess } from "../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../z_infra/time/infra"
import {
    RenewAuthnInfoRemoteAccess,
    RenewAuthnInfoSimulator,
} from "../../../infra"

export function initRenewAuthnInfoSimulateRemoteAccess(
    simulator: RenewAuthnInfoSimulator,
    time: WaitTime
): RenewAuthnInfoRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
