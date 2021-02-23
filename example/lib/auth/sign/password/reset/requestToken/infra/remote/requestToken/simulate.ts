import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
import { RequestTokenRemote, RequestTokenSimulator } from "../../../infra"

export function initRequestTokenSimulate(
    simulator: RequestTokenSimulator,
    time: WaitTime,
): RequestTokenRemote {
    return initSimulateRemoteAccess(simulator, time)
}
