import { initSimulateRemoteAccess } from "../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../z_infra/time/infra"
import { LoadMenuBadgeRemoteAccess, LoadMenuBadgeSimulator } from "../../../infra"

export function initLoadMenuBadgeSimulateRemoteAccess(
    simulator: LoadMenuBadgeSimulator,
    time: WaitTime
): LoadMenuBadgeRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
