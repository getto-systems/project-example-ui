import { initRemoteSimulator } from "../../../../../../../../z_vendor/getto-application/infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_vendor/getto-application/infra/config/infra"
import { GetSendingStatusRemote, GetSendingStatusSimulator } from "../../../infra"

export function initGetSendingStatusSimulate(
    simulator: GetSendingStatusSimulator,
    time: WaitTime,
): GetSendingStatusRemote {
    return initRemoteSimulator(simulator, time)
}
