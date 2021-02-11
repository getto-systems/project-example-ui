import { env } from "../../../../../../y_environment/env"

import { initApiAuthLogin } from "../../../../../../z_external/api/auth/login"

import { delayed } from "../../../../../../z_infra/delayed/core"
import { delaySecond } from "../../../../../../z_infra/time/infra"

import { initLoginConnectRemoteAccess } from "../../../../../login/passwordLogin/impl/remote/login/connect"

import { login } from "../../../../../login/passwordLogin/impl/core"

import { LoginInfra } from "../../../../../login/passwordLogin/infra"

import { PasswordLoginAction } from "../../../../../login/passwordLogin/action"

export function initPasswordLoginAction(): PasswordLoginAction {
    return {
        login: login(loginInfra()),
    }

    function loginInfra(): LoginInfra {
        return {
            login: initLoginConnectRemoteAccess(initApiAuthLogin(env.apiServerURL)),
            config: {
                delay: delaySecond(1),
            },
            delayed,
        }
    }
}
