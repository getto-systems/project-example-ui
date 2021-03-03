import { env } from "../../../../../../../y_environment/env"

import { newApi_ResetPassword } from "../../../../../../../z_external/api/auth/sign/password/reset/reset"

import { wrapRemote } from "../../../../../../../z_vendor/getto-application/infra/remote/helper"

import { ResetRemotePod } from "../../infra"

export function newResetPasswordRemote(): ResetRemotePod {
    return wrapRemote(newApi_ResetPassword(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
