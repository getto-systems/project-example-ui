//import { initAuthClient } from "../../z_external/auth_client/auth_client"
//import { env } from "../../y_static/env"

import { newTimeConfig } from "./config"

import { initPasswordResetComponent, initPasswordResetWorkerComponentHelper } from "../../auth/password_reset/core"

import { initPasswordResetAction } from "../../password_reset/impl/core"
import { initLoginIDFieldAction } from "../../field/login_id/impl/core"
import { initPasswordFieldAction } from "../../field/password/impl/core"

import { initSimulatePasswordResetSessionClient } from "../../password_reset/impl/client/password_reset_session/simulate"
import { initSimulatePasswordResetClient } from "../../password_reset/impl/client/password_reset/simulate"

import { PasswordResetSessionClient } from "../../password_reset/infra"
import { PasswordResetClient } from "../../password_reset/infra"

import { PasswordResetComponent, PasswordResetWorkerComponentHelper } from "../../auth/password_reset/action"

export function newPasswordResetComponent(): PasswordResetComponent {
    return initPasswordResetComponent({
        // TODO PasswordResetAction の初期化をまとめる
        passwordReset: initPasswordResetAction({
            timeConfig: newTimeConfig(),
            passwordResetSessionClient: newPasswordResetSessionClient(),
            passwordResetClient: newPasswordResetClient(),
        }),
        loginIDField: initLoginIDFieldAction(),
        passwordField: initPasswordFieldAction(),
    })
}

export function newWorkerHelper(): PasswordResetWorkerComponentHelper {
    return initPasswordResetWorkerComponentHelper()
}

function newPasswordResetSessionClient(): PasswordResetSessionClient {
    //return initFetchPasswordResetSessionClient(initAuthClient(env.authServerURL))
    return initSimulatePasswordResetSessionClient({ loginID: "loginID" })
}

function newPasswordResetClient(): PasswordResetClient {
    //return initFetchPasswordResetClient(initAuthClient(env.authServerURL))
    return initSimulatePasswordResetClient(
        { loginID: "loginID" },
        {
            ticketNonce: { ticketNonce: "nonce" },
            apiCredential: {
                apiRoles: { apiRoles: ["admin", "dev"] },
            },
        },
    )
}
