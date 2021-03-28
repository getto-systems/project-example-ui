import { env } from "../../../../../y_environment/env"

import { newApi_GetMenuBadge } from "../../../../../z_external/api/outline/get_menu_badge"
import {
    remoteFeature,
    remoteInfraError,
    wrapRemote,
} from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { GetMenuBadgeRemotePod } from "../../../infra"

export function newGetMenuBadgeRemote(webCrypto: Crypto): GetMenuBadgeRemotePod {
    return wrapRemote(
        newApi_GetMenuBadge(remoteFeature(env.apiServerURL, webCrypto)),
        remoteInfraError,
    )
}
