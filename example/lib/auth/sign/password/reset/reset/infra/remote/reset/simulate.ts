import { initSimulateRemoteAccess } from "../../../../../../../../z_vendor/getto-application/remote/simulate"

import { WaitTime } from "../../../../../../../../z_vendor/getto-application/infra/config/infra"
import { ResetRemote, ResetSimulator } from "../../../infra"

export function initResetSimulate(simulator: ResetSimulator, time: WaitTime): ResetRemote {
    return initSimulateRemoteAccess(simulator, time)
}
