import { env } from "../../../../../../../y_environment/env"

import { initApiLoadOutlineMenuBadge } from "../../../../../../../z_external/api/auth/permission/loadMenuBadge"
import { wrapRemoteError } from "../../../../../../../z_vendor/getto-application/infra/remote/helper"

import { LoadOutlineMenuBadgeRemote } from "../../../infra"

export function newLoadOutlineMenuBadgeRemote(): LoadOutlineMenuBadgeRemote {
    return wrapRemoteError(initApiLoadOutlineMenuBadge(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
