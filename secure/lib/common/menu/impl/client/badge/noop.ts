import { MenuBadgeClient, MenuBadgeResponse, MenuBadge } from "../../../infra"

import { ApiNonce } from "../../../../credential/data"

export function initNoopBadgeClient(): MenuBadgeClient {
    return new NoopMenuBadgeClient()
}

class NoopMenuBadgeClient implements MenuBadgeClient {
    async getBadge(_apiNonce: ApiNonce): Promise<MenuBadgeResponse> {
        return { success: true, badge: EMPTY_BADGE }
    }
}

const EMPTY_BADGE: MenuBadge = {}
