import { env } from "../../../../../y_environment/env"

import { newApi_GetMenuBadge } from "../../../../../z_external/api/outline/get_menu_badge"
import {
    remoteFeature,
    remoteInfraError,
    wrapRemote,
} from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { RemoteOutsideFeature } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { GetMenuBadgeRemotePod } from "../../../infra"

export function newGetMenuBadgeRemote(feature: RemoteOutsideFeature): GetMenuBadgeRemotePod {
    return wrapRemote(
        newApi_GetMenuBadge(remoteFeature(env.apiServerURL, feature)),
        remoteInfraError,
    )
}
