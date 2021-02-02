import { MenuBadgeClient, MenuBadgeResponse, MenuBadge } from "../../../infra"

import { ApiNonce } from "../../../../../common/credential/data"

export function initStaticMenuBadgeClient(menuBadge: MenuBadge): MenuBadgeClient {
    return new StaticMenuBadgeClient(menuBadge)
}

class StaticMenuBadgeClient implements MenuBadgeClient {
    menuBadge: MenuBadge

    constructor(menuBadge: MenuBadge) {
        this.menuBadge = menuBadge
    }

    async getBadge(_apiNonce: ApiNonce): Promise<MenuBadgeResponse> {
        return { success: true, menuBadge: this.menuBadge }
    }
}
