import { LoadOutlineMenuBadgeRemotePod, OutlineMenuBadgeItem } from "../../../infra"

export function newLoadOutlineMenuBadgeNoopRemote(): LoadOutlineMenuBadgeRemotePod {
    return () => async () => ({ success: true, value: EMPTY_BADGE })
}

const EMPTY_BADGE: OutlineMenuBadgeItem[] = []
