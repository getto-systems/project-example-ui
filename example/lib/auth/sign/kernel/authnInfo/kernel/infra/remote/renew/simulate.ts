import { initSimulateRemoteAccess } from "../../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_infra/time/infra"
import { RenewAuthnInfoRemote, RenewAuthnInfoSimulator } from "../../../infra"

export function initRenewAuthnInfoSimulate(
    simulator: RenewAuthnInfoSimulator,
    time: WaitTime
): RenewAuthnInfoRemote {
    return initSimulateRemoteAccess(simulator, time)
}
