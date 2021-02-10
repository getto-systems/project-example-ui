import { LoginRemoteAccess } from "../../../infra"

import { LoginFields, LoginRemoteError } from "../../../data"
import { AuthCredential } from "../../../../../common/credential/data"
import {
    initSimulateRemoteAccess,
    RemoteAccessSimulator,
} from "../../../../../../z_infra/remote/simulate"
import { WaitTime } from "../../../../../../z_infra/time/infra"
import { RemoteAccessResult } from "../../../../../../z_infra/remote/infra"

export type LoginSimulateResult = RemoteAccessResult<AuthCredential, LoginRemoteError>

export function initLoginSimulateRemoteAccess(
    simulator: LoginSimulator,
    time: WaitTime
): LoginRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}

type LoginSimulator = RemoteAccessSimulator<LoginFields, AuthCredential, LoginRemoteError>
