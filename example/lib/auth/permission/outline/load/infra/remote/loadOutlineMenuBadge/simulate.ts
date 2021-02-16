import { initSimulateRemoteAccess } from "../../../../../../../z_infra/remote/simulate"

import { WaitTime } from "../../../../../../../z_infra/time/infra"
import { LoadOutlineMenuBadgeRemoteAccess, LoadOutlineMenuBadgeSimulator } from "../../../infra"

export function initLoadOutlineMenuBadgeSimulateRemoteAccess(
    simulator: LoadOutlineMenuBadgeSimulator,
    time: WaitTime
): LoadOutlineMenuBadgeRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
