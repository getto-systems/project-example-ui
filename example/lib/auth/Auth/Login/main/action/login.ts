import { AuthClient } from "../../../../../z_external/api/authClient"

import { delayed } from "../../../../../z_infra/delayed/core"

import { initFetchPasswordLoginClient } from "../../../../login/passwordLogin/impl/remote/login/fetch"

import { login } from "../../../../login/passwordLogin/impl/core"

import { PasswordLoginActionConfig } from "../../../../login/passwordLogin/infra"

import { PasswordLoginAction } from "../../../../login/passwordLogin/action"

export function initPasswordLoginAction(
    config: PasswordLoginActionConfig,
    authClient: AuthClient
): PasswordLoginAction {
    return {
        login: login({
            login: initFetchPasswordLoginClient(authClient),
            config: config.login,
            delayed,
        }),
    }
}
