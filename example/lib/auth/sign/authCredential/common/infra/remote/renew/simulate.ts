import { initSimulateRemoteAccess } from "../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../z_infra/time/infra"
import { RenewRemoteAccess, RenewSimulator } from "../../../infra"

export function initRenewSimulateRemoteAccess(
    simulator: RenewSimulator,
    time: WaitTime
): RenewRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
