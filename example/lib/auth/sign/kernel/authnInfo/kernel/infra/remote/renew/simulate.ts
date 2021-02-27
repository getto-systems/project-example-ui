import { initRemoteSimulator } from "../../../../../../../../z_vendor/getto-application/infra/remote/simulate"

import { WaitTime } from "../../../../../../../../z_vendor/getto-application/infra/config/infra"
import { RenewRemote, RenewSimulator } from "../../../infra"

export function initRenewSimulate(simulator: RenewSimulator, time: WaitTime): RenewRemote {
    return initRemoteSimulator(simulator, time)
}
