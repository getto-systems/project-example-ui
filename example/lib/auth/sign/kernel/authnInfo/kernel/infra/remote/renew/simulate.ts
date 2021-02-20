import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
import { RenewAuthnInfoRemote, RenewAuthnInfoSimulator } from "../../../infra"

export function initRenewAuthnInfoSimulate(
    simulator: RenewAuthnInfoSimulator,
    time: WaitTime
): RenewAuthnInfoRemote {
    return initSimulateRemoteAccess(simulator, time)
}
