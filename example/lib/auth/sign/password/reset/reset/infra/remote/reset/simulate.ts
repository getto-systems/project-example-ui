import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
import { ResetRemote, ResetSimulator } from "../../../infra"

export function initResetSimulate(simulator: ResetSimulator, time: WaitTime): ResetRemote {
    return initSimulateRemoteAccess(simulator, time)
}
