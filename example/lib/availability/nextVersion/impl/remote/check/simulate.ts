import { CheckRemoteAccess, CheckSimulator } from "../../../infra"
import { WaitTime } from "../../../../../z_getto/infra/config/infra"

import { initSimulateRemoteAccess } from "../../../../../z_getto/infra/remote/simulate"

export function initCheckSimulateRemoteAccess(
    simulator: CheckSimulator,
    time: WaitTime
): CheckRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
