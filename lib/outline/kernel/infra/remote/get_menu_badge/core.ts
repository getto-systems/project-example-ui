import { env } from "../../../../../y_environment/env"

import { newApi_GetMenuBadge } from "../../../../../z_details/api/outline/get_menu_badge"
import {
    remoteFeature,
    convertRemote,
} from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { RemoteOutsideFeature } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { GetMenuBadgeRemotePod } from "../../../infra"

export function newGetMenuBadgeRemote(feature: RemoteOutsideFeature): GetMenuBadgeRemotePod {
    return convertRemote(newApi_GetMenuBadge(remoteFeature(env.apiServerURL, feature)))
}
