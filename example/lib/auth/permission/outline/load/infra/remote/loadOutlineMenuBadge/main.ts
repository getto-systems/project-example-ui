import { env } from "../../../../../../../y_environment/env"

import { initApiLoadOutlineMenuBadge } from "../../../../../../../z_external/api/auth/permission/loadMenuBadge"

import { LoadOutlineMenuBadgeRemote } from "../../../infra"

export function newLoadOutlineMenuBadgeRemote(): LoadOutlineMenuBadgeRemote {
    return initApiLoadOutlineMenuBadge(env.apiServerURL)
}
