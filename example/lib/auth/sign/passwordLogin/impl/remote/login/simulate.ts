import { LoginRemoteAccess, LoginSimulator } from "../../../infra"
import { WaitTime } from "../../../../../../z_infra/time/infra"

import { initSimulateRemoteAccess } from "../../../../../../z_infra/remote/simulate"

export function initLoginSimulateRemoteAccess(
    simulator: LoginSimulator,
    time: WaitTime
): LoginRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
