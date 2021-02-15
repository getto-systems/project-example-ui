import { initSimulateRemoteAccess } from "../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../z_infra/time/infra"
import { RenewAuthCredentialRemoteAccess, RenewAuthCredentialSimulator } from "../../../infra"

export function initRenewAuthCredentialSimulateRemoteAccess(
    simulator: RenewAuthCredentialSimulator,
    time: WaitTime
): RenewAuthCredentialRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
