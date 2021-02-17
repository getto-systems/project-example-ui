import {
    AuthenticatePasswordRemote,
    AuthenticatePasswordSimulator,
} from "../../../infra"
import { WaitTime } from "../../../../../../../z_infra/time/infra"

import { initSimulateRemoteAccess } from "../../../../../../../z_infra/remote/simulate"

export function initAuthenticatePasswordSimulate(
    simulator: AuthenticatePasswordSimulator,
    time: WaitTime
): AuthenticatePasswordRemote {
    return initSimulateRemoteAccess(simulator, time)
}
