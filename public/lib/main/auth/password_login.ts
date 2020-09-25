import { env } from "../../y_static/env"

import { initAuthClient } from "../../z_external/auth_client/auth_client"

import { newTimeConfig } from "./config"

import { initPasswordLoginComponent, initPasswordLoginWorkerComponentHelper } from "../../auth/component/password_login/impl"

import { initPasswordLoginAction } from "../../password_login/impl/core"
import { initLoginIDFieldAction } from "../../field/login_id/impl/core"
import { initPasswordFieldAction } from "../../field/password/impl/core"

import { initFetchPasswordLoginClient } from "../../password_login/impl/client/password_login/fetch"

import { PasswordLoginClient } from "../../password_login/infra"

import { PasswordLoginComponent, PasswordLoginWorkerComponentHelper } from "../../auth/component/password_login"

export function newPasswordLoginComponent(): PasswordLoginComponent {
    return initPasswordLoginComponent({
        passwordLogin: initPasswordLoginAction({
            timeConfig: newTimeConfig(),
            passwordLoginClient: newPasswordLoginClient(),
        }),
        loginIDField: initLoginIDFieldAction(),
        passwordField: initPasswordFieldAction(),
    })
}

export function newWorkerHelper(): PasswordLoginWorkerComponentHelper {
    return initPasswordLoginWorkerComponentHelper()
}

function newPasswordLoginClient(): PasswordLoginClient {
    return initFetchPasswordLoginClient(initAuthClient(env.authServerURL))
}
