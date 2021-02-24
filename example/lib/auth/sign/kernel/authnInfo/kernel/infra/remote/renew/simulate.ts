import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
import { RenewRemote, RenewSimulator } from "../../../infra"

export function initRenewSimulate(simulator: RenewSimulator, time: WaitTime): RenewRemote {
    return initSimulateRemoteAccess(simulator, time)
}
