import { RenewRemoteAccess } from "../../../infra"

import { AuthCredential, TicketNonce } from "../../../../../common/credential/data"
import { RemoteAccessResult } from "../../../../../../z_infra/remote/infra"
import { RenewRemoteError } from "../../../data"
import { WaitTime } from "../../../../../../z_infra/time/infra"
import {
    initSimulateRemoteAccess,
    RemoteAccessSimulator,
} from "../../../../../../z_infra/remote/simulate"

export type RenewSimulateResult = RemoteAccessResult<AuthCredential, RenewRemoteError>

export function initRenewSimulateRemoteAccess(
    simulator: RenewSimulator,
    time: WaitTime
): RenewRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}

type RenewSimulator = RemoteAccessSimulator<TicketNonce, AuthCredential, RenewRemoteError>
