import { env } from "../../../../../../y_environment/env"

import { initApi_LoadMenuBadge } from "../../../../../../z_external/api/auth/permission/loadMenuBadge"
import { wrapRemote } from "../../../../../../z_vendor/getto-application/infra/remote/helper"

import { GetMenuBadgeRemotePod } from "../../../infra"

export function newGetMenuBadgeRemote(): GetMenuBadgeRemotePod {
    return wrapRemote(initApi_LoadMenuBadge(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
