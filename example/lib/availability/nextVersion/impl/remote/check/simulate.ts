import { CheckRemoteAccess, CheckSimulator } from "../../../infra"
import { WaitTime } from "../../../../../z_vendor/getto-application/infra/config/infra"

import { initRemoteSimulator } from "../../../../../z_vendor/getto-application/infra/remote/simulate"

export function initCheckSimulateRemoteAccess(
    simulator: CheckSimulator,
    time: WaitTime
): CheckRemoteAccess {
    return initRemoteSimulator(simulator, time)
}
