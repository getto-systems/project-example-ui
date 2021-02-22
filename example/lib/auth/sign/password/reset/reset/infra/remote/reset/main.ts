import { initApiAuthSignResetRegister } from "../../../../../../../../z_external/api/auth/sign/reset/register"

import { env } from "../../../../../../../../y_environment/env"

import { initResetPasswordConnect } from "./connect"

import { ResetPasswordRemote } from "../../../infra"

export function newResetPasswordRemote(): ResetPasswordRemote {
    return initResetPasswordConnect(initApiAuthSignResetRegister(env.apiServerURL))
}
