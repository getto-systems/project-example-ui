import { RenewRemoteAccess, RenewSimulator } from "../../../infra"
import { WaitTime } from "../../../../../../../z_infra/time/infra"

import { initSimulateRemoteAccess } from "../../../../../../../z_infra/remote/simulate"

export function initRenewSimulateRemoteAccess(
    simulator: RenewSimulator,
    time: WaitTime
): RenewRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
