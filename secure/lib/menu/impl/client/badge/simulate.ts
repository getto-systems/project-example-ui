import { MenuBadgeClient, MenuBadgeResponse, MenuBadge } from "../../../infra"

import { ApiNonce } from "../../../../credential/data"

export function initSimulateRenewClient(badge: MenuBadge): MenuBadgeClient {
    return new SimulateMenuBadgeClient(badge)
}

class SimulateMenuBadgeClient implements MenuBadgeClient {
    badge: MenuBadge

    constructor(badge: MenuBadge) {
        this.badge = badge
    }

    async getBadge(_apiNonce: ApiNonce): Promise<MenuBadgeResponse> {
        return { success: true, badge: this.badge }
    }
}
