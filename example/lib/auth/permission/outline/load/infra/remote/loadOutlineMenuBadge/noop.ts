import { LoadOutlineMenuBadgeRemote, OutlineMenuBadgeItem } from "../../../infra"

export function newLoadOutlineMenuBadgeNoopRemote(): LoadOutlineMenuBadgeRemote {
    return async () => ({ success: true, value: EMPTY_BADGE })
}

const EMPTY_BADGE: OutlineMenuBadgeItem[] = []
