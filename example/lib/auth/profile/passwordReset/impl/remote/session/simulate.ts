import {
    initSimulateRemoteAccess,
    RemoteAccessSimulator,
} from "../../../../../../z_infra/remote/simulate"

import { RemoteAccessResult } from "../../../../../../z_infra/remote/infra"
import { WaitTime } from "../../../../../../z_infra/time/infra"
import {
    GetStatusRemoteAccess,
    GetStatusResponse,
    SendTokenRemoteAccess,
    StartSessionRemoteAccess,
} from "../../../infra"

import { CheckStatusRemoteError, StartSessionFields, StartSessionRemoteError } from "../../../data"
import { SessionID } from "../../../data"

export type StartSessionSimulateResult = RemoteAccessResult<SessionID, StartSessionRemoteError>
export type SendTokenSimulateResult = RemoteAccessResult<true, CheckStatusRemoteError>
export type GetStatusSimulateResult = RemoteAccessResult<GetStatusResponse, CheckStatusRemoteError>

export function initStartSessionSimulateRemoteAccess(
    simulator: StartSessionSimulator,
    time: WaitTime
): StartSessionRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}

export function initSendTokenSimulateRemoteAccess(
    simulator: SendTokenSimulator,
    time: WaitTime
): SendTokenRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}

export function initGetStatusSimulateRemoteAccess(
    simulator: GetStatusSimulator,
    time: WaitTime
): GetStatusRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}

type StartSessionSimulator = RemoteAccessSimulator<
    StartSessionFields,
    SessionID,
    StartSessionRemoteError
>
type SendTokenSimulator = RemoteAccessSimulator<null, true, CheckStatusRemoteError>
type GetStatusSimulator = RemoteAccessSimulator<SessionID, GetStatusResponse, CheckStatusRemoteError>
