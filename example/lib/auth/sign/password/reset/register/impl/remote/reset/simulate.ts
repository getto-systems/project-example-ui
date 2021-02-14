import { initSimulateRemoteAccess } from "../../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_infra/time/infra"
import { ResetRemoteAccess, ResetSimulator } from "../../../infra"

export function initResetSimulateRemoteAccess(
    simulator: ResetSimulator,
    time: WaitTime
): ResetRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
