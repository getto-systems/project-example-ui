import { env } from "../../../../../y_environment/env"

import { newApiNotifyUnexpectedError } from "../../../../../z_external/api/availability/notifyUnexpectedError"

import { wrapRemoteError } from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { NotifyUnexpectedErrorRemote } from "../../../infra"

export function newNotifyUnexpectedErrorRemote(): NotifyUnexpectedErrorRemote {
    return wrapRemoteError(newApiNotifyUnexpectedError(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
