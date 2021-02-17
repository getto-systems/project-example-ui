import { initSimulateRemoteAccess } from "../../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_infra/time/infra"
import { RegisterPasswordRemote, RegisterPasswordSimulator } from "../../../infra"

export function initRegisterPasswordSimulate(
    simulator: RegisterPasswordSimulator,
    time: WaitTime
): RegisterPasswordRemote {
    return initSimulateRemoteAccess(simulator, time)
}
