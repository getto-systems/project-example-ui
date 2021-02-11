import { CheckRemoteAccess, CheckSimulator } from "../../../infra"
import { WaitTime } from "../../../../../z_infra/time/infra"

import { initSimulateRemoteAccess } from "../../../../../z_infra/remote/simulate"

export function initCheckSimulateRemoteAccess(
    simulator: CheckSimulator,
    time: WaitTime
): CheckRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
