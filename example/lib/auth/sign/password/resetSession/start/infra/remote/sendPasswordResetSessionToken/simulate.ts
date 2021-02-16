import { initSimulateRemoteAccess } from "../../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_infra/time/infra"
import {
    SendPasswordResetSessionTokenRemoteAccess,
    SendPasswordResetSessionTokenSimulator,
} from "../../../infra"

export function initSendPasswordResetSessionTokenSimulateRemoteAccess(
    simulator: SendPasswordResetSessionTokenSimulator,
    time: WaitTime
): SendPasswordResetSessionTokenRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
