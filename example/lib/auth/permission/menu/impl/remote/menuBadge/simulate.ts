import {
    initSimulateRemoteAccess,
    RemoteAccessSimulator,
} from "../../../../../../z_infra/remote/simulate"

import { RemoteAccessResult } from "../../../../../../z_infra/remote/infra"
import { WaitTime } from "../../../../../../z_infra/time/infra"
import { LoadMenuBadgeRemoteAccess, MenuBadge } from "../../../infra"

import { ApiNonce } from "../../../../../common/credential/data"
import { LoadMenuBadgeRemoteError } from "../../../data"

export type LoadMenuBadgeSimulateResult = RemoteAccessResult<MenuBadge, LoadMenuBadgeRemoteError>

export function initLoadMenuBadgeSimulateRemoteAccess(
    simulator: LoadMenuBadgeSimulator,
    time: WaitTime
): LoadMenuBadgeRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}

type LoadMenuBadgeSimulator = RemoteAccessSimulator<ApiNonce, MenuBadge, LoadMenuBadgeRemoteError>
