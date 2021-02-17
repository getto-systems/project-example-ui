import { initSimulateRemoteAccess } from "../../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_infra/time/infra"
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
