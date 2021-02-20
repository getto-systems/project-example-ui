import { initSimulateRemoteAccess } from "../../../../../../../z_getto/infra/remote/simulate"

import { OutlineMenuBadge, LoadOutlineMenuBadgeRemoteAccess } from "../../../infra"

export function newLoadOutlineMenuBadgeNoopRemoteAccess(): LoadOutlineMenuBadgeRemoteAccess {
    return initSimulateRemoteAccess(() => ({ success: true, value: EMPTY_BADGE }), {
        wait_millisecond: 0,
    })
}

const EMPTY_BADGE: OutlineMenuBadge = {}
