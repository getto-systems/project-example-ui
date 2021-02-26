import { initSimulateRemoteAccess } from "../../../../../../../../z_vendor/getto-application/remote/simulate"

import { WaitTime } from "../../../../../../../../z_vendor/getto-application/infra/config/infra"
import { RequestTokenRemote, RequestTokenSimulator } from "../../../infra"

export function initRequestTokenSimulate(
    simulator: RequestTokenSimulator,
    time: WaitTime,
): RequestTokenRemote {
    return initSimulateRemoteAccess(simulator, time)
}
