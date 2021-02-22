import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
import {
    RequestPasswordResetTokenRemote,
    RequestPasswordResetTokenSimulator,
} from "../../../infra"

export function initRequestPasswordResetTokenSimulate(
    simulator: RequestPasswordResetTokenSimulator,
    time: WaitTime
): RequestPasswordResetTokenRemote {
    return initSimulateRemoteAccess(simulator, time)
}
