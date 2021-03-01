import {
    AuthenticateRemote,
    AuthenticateSimulator,
} from "../../../infra"
import { WaitTime } from "../../../../../../../z_vendor/getto-application/infra/config/infra"

import { initRemoteSimulator_legacy } from "../../../../../../../z_vendor/getto-application/infra/remote/simulate"

export function initAuthenticateSimulate(
    simulator: AuthenticateSimulator,
    time: WaitTime
): AuthenticateRemote {
    return initRemoteSimulator_legacy(simulator, time)
}
