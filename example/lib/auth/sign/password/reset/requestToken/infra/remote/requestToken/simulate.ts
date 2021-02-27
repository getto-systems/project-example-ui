import { initRemoteSimulator } from "../../../../../../../../z_vendor/getto-application/infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_vendor/getto-application/infra/config/infra"
import { RequestTokenRemote, RequestTokenSimulator } from "../../../infra"

export function initRequestTokenSimulate(
    simulator: RequestTokenSimulator,
    time: WaitTime,
): RequestTokenRemote {
    return initRemoteSimulator(simulator, time)
}
