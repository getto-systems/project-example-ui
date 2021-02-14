import { initSimulateRemoteAccess } from "../../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_infra/time/infra"
import { RegisterRemoteAccess, RegisterSimulator } from "../../../infra"

export function initResetSimulateRemoteAccess(
    simulator: RegisterSimulator,
    time: WaitTime
): RegisterRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
