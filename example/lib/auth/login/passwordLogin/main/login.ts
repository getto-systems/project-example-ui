import { env } from "../../../../y_environment/env"

import { initApiAuthLogin } from "../../../../z_external/api/auth/login"

import { delayed } from "../../../../z_infra/delayed/core"
import { delaySecond } from "../../../../z_infra/time/infra"

import { initLoginConnectRemoteAccess } from "../impl/remote/login/connect"

import { login } from "../impl/core"

import { LoginInfra } from "../infra"

import { LoginAction } from "../action"

export function initPasswordLoginAction(): LoginAction {
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
