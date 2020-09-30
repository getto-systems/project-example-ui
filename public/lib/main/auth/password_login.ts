import { env } from "../../y_static/env"
import { delayed } from "../../z_external/delayed"

import { initAuthClient } from "../../z_external/auth_client/auth_client"

import { newTimeConfig } from "./config"

import { initPasswordLoginComponent, initPasswordLoginWorkerComponentHelper } from "../../auth/component/password_login/impl"

import { initPasswordLoginAction } from "../../password_login/impl/core"
import { initLoginIDFieldAction } from "../../login_id/field/impl/core"
import { initPasswordFieldAction } from "../../password/field/impl/core"

import { initFetchPasswordLoginClient } from "../../password_login/impl/client/password_login/fetch"

import { PasswordLoginClient } from "../../password_login/infra"

import { AuthBackground } from "../../auth/usecase"

import { PasswordLoginComponent, PasswordLoginWorkerComponentHelper } from "../../auth/component/password_login/component"

export function newPasswordLoginComponent(background: AuthBackground): PasswordLoginComponent {
    return initPasswordLoginComponent(background, {
        passwordLogin: initPasswordLoginAction({
            timeConfig: newTimeConfig(),
            passwordLoginClient: newPasswordLoginClient(),
            delayed,
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
