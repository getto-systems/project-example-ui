import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
import {
    StartPasswordResetSessionSessionRemote,
    StartPasswordResetSessionSessionSimulator,
} from "../../../infra"

export function initStartPasswordResetSessionSimulate(
    simulator: StartPasswordResetSessionSessionSimulator,
    time: WaitTime
): StartPasswordResetSessionSessionRemote {
    return initSimulateRemoteAccess(simulator, time)
}
