import {
    initSimulateRemoteAccess,
    RemoteAccessSimulator,
} from "../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../z_infra/time/infra"
import { RemoteAccessResult } from "../../../../../../z_infra/remote/infra"
import { ResetMessage, ResetRemoteAccess } from "../../../infra"

import { AuthCredential } from "../../../../../common/credential/data"
import { ResetRemoteError } from "../../../data"

export type ResetSimulateResult = RemoteAccessResult<AuthCredential, ResetRemoteError>

export function initResetSimulateRemoteAccess(
    simulator: ResetSimulator,
    time: WaitTime
): ResetRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}

type ResetSimulator = RemoteAccessSimulator<ResetMessage, AuthCredential, ResetRemoteError>
