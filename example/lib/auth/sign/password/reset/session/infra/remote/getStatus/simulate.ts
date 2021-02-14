import { initSimulateRemoteAccess } from "../../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_infra/time/infra"
import { GetStatusRemoteAccess, GetStatusSimulator } from "../../../infra"

export function initGetStatusSimulateRemoteAccess(
    simulator: GetStatusSimulator,
    time: WaitTime
): GetStatusRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
