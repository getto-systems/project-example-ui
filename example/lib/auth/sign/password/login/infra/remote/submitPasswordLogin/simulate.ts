import { SubmitPasswordLoginRemoteAccess, SubmitPasswordLoginSimulator } from "../../../infra"
import { WaitTime } from "../../../../../../../z_infra/time/infra"

import { initSimulateRemoteAccess } from "../../../../../../../z_infra/remote/simulate"

export function initSubmitPasswordLoginSimulateRemoteAccess(
    simulator: SubmitPasswordLoginSimulator,
    time: WaitTime
): SubmitPasswordLoginRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
