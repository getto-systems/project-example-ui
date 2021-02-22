import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
import {
    GetPasswordResetSendingStatusRemote,
    GetPasswordResetSendingStatusSimulator,
} from "../../../infra"

export function initGetPasswordResetSendingStatusSimulate(
    simulator: GetPasswordResetSendingStatusSimulator,
    time: WaitTime,
): GetPasswordResetSendingStatusRemote {
    return initSimulateRemoteAccess(simulator, time)
}
