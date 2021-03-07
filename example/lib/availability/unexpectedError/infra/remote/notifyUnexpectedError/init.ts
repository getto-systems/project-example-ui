import { env } from "../../../../../y_environment/env"

import { newApi_NotifyUnexpectedError } from "../../../../../z_external/api/availability/notifyUnexpectedError"

import { wrapRemote } from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { NotifyUnexpectedErrorRemotePod } from "../../../infra"

export function newNotifyUnexpectedErrorRemote(): NotifyUnexpectedErrorRemotePod {
    return wrapRemote(newApi_NotifyUnexpectedError(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
