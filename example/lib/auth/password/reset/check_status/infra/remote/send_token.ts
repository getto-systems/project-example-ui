import { env } from "../../../../../../y_environment/env"

import { newApi_SendResetToken } from "../../../../../../z_external/api/auth/sign/password/reset/check_status/send_token"

import { wrapRemote } from "../../../../../../z_vendor/getto-application/infra/remote/helper"

import { SendResetTokenRemotePod } from "../../infra"

export function newSendResetTokenRemote(): SendResetTokenRemotePod {
    return wrapRemote(newApi_SendResetToken(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
