import { initSimulateRemoteAccess } from "../../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_infra/time/infra"
import {
    SendPasswordResetSessionTokenRemote,
    SendPasswordResetSessionTokenSimulator,
} from "../../../infra"

export function initSendPasswordResetSessionTokenSimulate(
    simulator: SendPasswordResetSessionTokenSimulator,
    time: WaitTime
): SendPasswordResetSessionTokenRemote {
    return initSimulateRemoteAccess(simulator, time)
}
