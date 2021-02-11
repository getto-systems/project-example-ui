import { ApiAuthLogin } from "../../../../../../z_external/api/auth/login"

import { delayed } from "../../../../../../z_infra/delayed/core"

import { initLoginConnectRemoteAccess } from "../../../../../login/passwordLogin/impl/remote/login/connect"

import { login } from "../../../../../login/passwordLogin/impl/core"

import { PasswordLoginActionConfig } from "../../../../../login/passwordLogin/infra"

import { PasswordLoginAction } from "../../../../../login/passwordLogin/action"

export function initPasswordLoginAction(
    config: PasswordLoginActionConfig,
    apiAuthLogin: ApiAuthLogin
): PasswordLoginAction {
    return {
        login: login({
            login: initLoginConnectRemoteAccess(apiAuthLogin),
            config: config.login,
            delayed,
        }),
    }
}
