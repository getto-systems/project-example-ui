import { initApiAuthSignResetRegister } from "../../../../../../../../z_external/api/auth/sign/reset/register"

import { env } from "../../../../../../../../y_environment/env"

import { initRegisterPasswordConnect } from "./connect"

import { RegisterPasswordRemote } from "../../../infra"

export function newRegisterPasswordRemote(): RegisterPasswordRemote {
    return initRegisterPasswordConnect(initApiAuthSignResetRegister(env.apiServerURL))
}
