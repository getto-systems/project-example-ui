import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
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
