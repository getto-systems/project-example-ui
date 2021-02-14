import { initSimulateRemoteAccess } from "../../../../../../z_infra/remote/simulate"

import { MenuBadge, LoadMenuBadgeRemoteAccess } from "../../../infra"

export function newLoadMenuBadgeNoopRemoteAccess(): LoadMenuBadgeRemoteAccess {
    return initSimulateRemoteAccess(() => ({ success: true, value: EMPTY_BADGE }), {
        wait_millisecond: 0,
    })
}

const EMPTY_BADGE: MenuBadge = {}
