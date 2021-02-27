import { initRemoteSimulator } from "../../../../../../../../z_vendor/getto-application/infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_vendor/getto-application/infra/config/infra"
import { ResetRemote, ResetSimulator } from "../../../infra"

export function initResetSimulate(simulator: ResetSimulator, time: WaitTime): ResetRemote {
    return initRemoteSimulator(simulator, time)
}
