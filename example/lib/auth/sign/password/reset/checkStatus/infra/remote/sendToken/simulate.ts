import { initSimulateRemoteAccess } from "../../../../../../../../z_vendor/getto-application/remote/simulate"

import { WaitTime } from "../../../../../../../../z_vendor/getto-application/infra/config/infra"
import { SendTokenRemote, SendTokenSimulator } from "../../../infra"

export function initSendTokenSimulate(
    simulator: SendTokenSimulator,
    time: WaitTime,
): SendTokenRemote {
    return initSimulateRemoteAccess(simulator, time)
}
