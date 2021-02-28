import { env } from "../../../../../y_environment/env"

import { initApiAvailableNotify } from "../../../../../z_external/api/availability/notify"

import { unwrapRemoteError } from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { NotifyUnexpectedErrorRemote } from "../../../infra"

export function newNotifyUnexpectedErrorRemoteAccess(): NotifyUnexpectedErrorRemote {
    return unwrapRemoteError(initApiAvailableNotify(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
