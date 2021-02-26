import { CheckRemoteAccess, CheckSimulator } from "../../../infra"
import { WaitTime } from "../../../../../z_vendor/getto-application/infra/config/infra"

import { initSimulateRemoteAccess } from "../../../../../z_vendor/getto-application/remote/simulate"

export function initCheckSimulateRemoteAccess(
    simulator: CheckSimulator,
    time: WaitTime
): CheckRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
