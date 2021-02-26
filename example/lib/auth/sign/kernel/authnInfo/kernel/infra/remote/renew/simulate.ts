import { initSimulateRemoteAccess } from "../../../../../../../../z_vendor/getto-application/remote/simulate"

import { WaitTime } from "../../../../../../../../z_vendor/getto-application/infra/config/infra"
import { RenewRemote, RenewSimulator } from "../../../infra"

export function initRenewSimulate(simulator: RenewSimulator, time: WaitTime): RenewRemote {
    return initSimulateRemoteAccess(simulator, time)
}
