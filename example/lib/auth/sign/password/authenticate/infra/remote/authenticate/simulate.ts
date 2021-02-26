import {
    AuthenticateRemote,
    AuthenticateSimulator,
} from "../../../infra"
import { WaitTime } from "../../../../../../../z_vendor/getto-application/infra/config/infra"

import { initSimulateRemoteAccess } from "../../../../../../../z_vendor/getto-application/remote/simulate"

export function initAuthenticateSimulate(
    simulator: AuthenticateSimulator,
    time: WaitTime
): AuthenticateRemote {
    return initSimulateRemoteAccess(simulator, time)
}
