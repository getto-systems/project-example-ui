import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
import { SendPasswordResetTokenRemote, SendPasswordResetTokenSimulator } from "../../../infra"

export function initSendPasswordResetTokenSimulate(
    simulator: SendPasswordResetTokenSimulator,
    time: WaitTime,
): SendPasswordResetTokenRemote {
    return initSimulateRemoteAccess(simulator, time)
}
