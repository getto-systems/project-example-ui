import { initSimulateRemoteAccess } from "../../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_infra/time/infra"
import {
    SubmitPasswordResetRegisterRemoteAccess,
    SubmitPasswordResetRegisterSimulator,
} from "../../../infra"

export function initSubmitPasswordResetResetSimulateRemoteAccess(
    simulator: SubmitPasswordResetRegisterSimulator,
    time: WaitTime
): SubmitPasswordResetRegisterRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
