import { initSimulateRemoteAccess } from "../../../../../../../z_vendor/getto-application/remote/simulate"

import { WaitTime } from "../../../../../../../z_vendor/getto-application/infra/config/infra"
import { LoadOutlineMenuBadgeRemoteAccess, LoadOutlineMenuBadgeSimulator } from "../../../infra"

export function initLoadOutlineMenuBadgeSimulateRemoteAccess(
    simulator: LoadOutlineMenuBadgeSimulator,
    time: WaitTime
): LoadOutlineMenuBadgeRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
