import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
import { ResetPasswordRemote, ResetPasswordSimulator } from "../../../infra"

export function initResetPasswordSimulate(
    simulator: ResetPasswordSimulator,
    time: WaitTime,
): ResetPasswordRemote {
    return initSimulateRemoteAccess(simulator, time)
}
