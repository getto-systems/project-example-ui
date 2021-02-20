import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
import { RegisterPasswordRemote, RegisterPasswordSimulator } from "../../../infra"

export function initRegisterPasswordSimulate(
    simulator: RegisterPasswordSimulator,
    time: WaitTime
): RegisterPasswordRemote {
    return initSimulateRemoteAccess(simulator, time)
}
