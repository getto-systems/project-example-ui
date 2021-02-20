import {
    AuthenticatePasswordRemote,
    AuthenticatePasswordSimulator,
} from "../../../infra"
import { WaitTime } from "../../../../../../../z_getto/infra/config/infra"

import { initSimulateRemoteAccess } from "../../../../../../../z_getto/infra/remote/simulate"

export function initAuthenticatePasswordSimulate(
    simulator: AuthenticatePasswordSimulator,
    time: WaitTime
): AuthenticatePasswordRemote {
    return initSimulateRemoteAccess(simulator, time)
}
