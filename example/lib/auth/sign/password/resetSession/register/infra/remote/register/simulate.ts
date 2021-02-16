import { initSimulateRemoteAccess } from "../../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_infra/time/infra"
import {
    RegisterPasswordResetSessionRemoteAccess,
    RegisterPasswordResetSessionSimulator,
} from "../../../infra"

export function initRegisterPasswordResetSessionSimulateRemoteAccess(
    simulator: RegisterPasswordResetSessionSimulator,
    time: WaitTime
): RegisterPasswordResetSessionRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
