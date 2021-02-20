import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
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
