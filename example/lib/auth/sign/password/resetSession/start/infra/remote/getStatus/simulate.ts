import { initSimulateRemoteAccess } from "../../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_infra/time/infra"
import {
    GetPasswordResetSessionStatusRemote,
    GetPasswordResetSessionStatusSimulator,
} from "../../../infra"

export function initGetPasswordResetSessionStatusSimulate(
    simulator: GetPasswordResetSessionStatusSimulator,
    time: WaitTime
): GetPasswordResetSessionStatusRemote {
    return initSimulateRemoteAccess(simulator, time)
}
