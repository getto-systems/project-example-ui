import { initSimulateRemoteAccess } from "../../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_infra/time/infra"
import {
    StartPasswordResetSessionSessionRemoteAccess,
    StartPasswordResetSessionSessionSimulator,
} from "../../../infra"

export function initStartPasswordResetSessionSimulateRemoteAccess(
    simulator: StartPasswordResetSessionSessionSimulator,
    time: WaitTime
): StartPasswordResetSessionSessionRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
