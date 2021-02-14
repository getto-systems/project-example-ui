import { env } from "../../../../../../y_environment/env"

import { initLoadMenuBadgeConnectRemoteAccess } from "./connect"

import { LoadMenuBadgeRemoteAccess } from "../../../infra"
import { initApiAuthPermissionLoadMenuBadge } from "../../../../../../z_external/api/auth/permission/loadMenuBadge"

export function newLoadMenuBadgeRemoteAccess(): LoadMenuBadgeRemoteAccess {
    return initLoadMenuBadgeConnectRemoteAccess(initApiAuthPermissionLoadMenuBadge(env.apiServerURL))
}
