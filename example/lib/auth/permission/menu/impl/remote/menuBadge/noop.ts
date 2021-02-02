import { MenuBadgeClient, MenuBadgeResponse, MenuBadge } from "../../../infra"

import { ApiNonce } from "../../../../../common/credential/data"

export function initNoopMenuBadgeClient(): MenuBadgeClient {
    return new NoopMenuBadgeClient()
}

class NoopMenuBadgeClient implements MenuBadgeClient {
    async getBadge(_apiNonce: ApiNonce): Promise<MenuBadgeResponse> {
        return { success: true, menuBadge: EMPTY_BADGE }
    }
}

const EMPTY_BADGE: MenuBadge = {}
