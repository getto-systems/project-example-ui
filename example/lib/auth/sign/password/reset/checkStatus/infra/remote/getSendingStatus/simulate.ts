import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
import { GetSendingStatusRemote, GetSendingStatusSimulator } from "../../../infra"

export function initGetSendingStatusSimulate(
    simulator: GetSendingStatusSimulator,
    time: WaitTime,
): GetSendingStatusRemote {
    return initSimulateRemoteAccess(simulator, time)
}
