import { env } from "../../../../../../y_environment/env"

import { initLoadOutlineMenuBadgeConnectRemoteAccess } from "./connect"

import { LoadOutlineMenuBadgeRemoteAccess } from "../../../infra"
import { initApiAuthPermissionLoadMenuBadge } from "../../../../../../z_external/api/auth/permission/loadMenuBadge"

export function newLoadOutlineMenuBadgeRemoteAccess(): LoadOutlineMenuBadgeRemoteAccess {
    return initLoadOutlineMenuBadgeConnectRemoteAccess(initApiAuthPermissionLoadMenuBadge(env.apiServerURL))
}
