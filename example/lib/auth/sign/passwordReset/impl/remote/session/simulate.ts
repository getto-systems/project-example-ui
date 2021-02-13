import { initSimulateRemoteAccess } from "../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../z_infra/time/infra"
import {
    GetStatusRemoteAccess,
    GetStatusSimulator,
    SendTokenRemoteAccess,
    SendTokenSimulator,
    StartSessionRemoteAccess,
    StartSessionSimulator,
} from "../../../infra"

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
