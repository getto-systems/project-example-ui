import {
    AuthenticateRemote,
    AuthenticateSimulator,
} from "../../../infra"
import { WaitTime } from "../../../../../../../z_getto/infra/config/infra"

import { initSimulateRemoteAccess } from "../../../../../../../z_getto/remote/simulate"

export function initAuthenticateSimulate(
    simulator: AuthenticateSimulator,
    time: WaitTime
): AuthenticateRemote {
    return initSimulateRemoteAccess(simulator, time)
}
