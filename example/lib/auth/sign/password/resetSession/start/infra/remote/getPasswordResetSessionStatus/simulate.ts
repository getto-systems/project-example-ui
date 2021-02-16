import { initSimulateRemoteAccess } from "../../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_infra/time/infra"
import {
    GetPasswordResetSessionStatusRemoteAccess,
    GetPasswordResetSessionStatusSimulator,
} from "../../../infra"

export function initGetPasswordResetSessionStatusSimulateRemoteAccess(
    simulator: GetPasswordResetSessionStatusSimulator,
    time: WaitTime
): GetPasswordResetSessionStatusRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
