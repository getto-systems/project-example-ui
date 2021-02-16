import { AuthenticatePasswordRemoteAccess, AuthenticatePasswordSimulator } from "../../../infra"
import { WaitTime } from "../../../../../../../z_infra/time/infra"

import { initSimulateRemoteAccess } from "../../../../../../../z_infra/remote/simulate"

export function initAuthenticatePasswordSimulateRemoteAccess(
    simulator: AuthenticatePasswordSimulator,
    time: WaitTime
): AuthenticatePasswordRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
