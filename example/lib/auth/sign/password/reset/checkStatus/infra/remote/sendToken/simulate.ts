import { initRemoteSimulator } from "../../../../../../../../z_vendor/getto-application/infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_vendor/getto-application/infra/config/infra"
import { SendTokenRemote, SendTokenSimulator } from "../../../infra"

export function initSendTokenSimulate(
    simulator: SendTokenSimulator,
    time: WaitTime,
): SendTokenRemote {
    return initRemoteSimulator(simulator, time)
}
