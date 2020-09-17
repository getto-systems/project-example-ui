//import { initAuthClient } from "../../z_external/auth_client/auth_client"
//import { env } from "../../y_static/env"

import { newTimeConfig } from "./config"

import {
    initPasswordResetSessionComponent,
    initPasswordResetSessionWorkerComponentHelper,
} from "../../auth/password_reset_session/core"

import { initPasswordResetSessionAction } from "../../password_reset_session/impl/core"
import { initLoginIDFieldAction } from "../../field/login_id/impl/core"

import { initSimulatePasswordResetSessionClient } from "../../password_reset_session/impl/client/password_reset_session/simulate"

import { PasswordResetSessionClient } from "../../password_reset_session/infra"

import { PasswordResetSessionComponent, PasswordResetSessionWorkerComponentHelper } from "../../auth/password_reset_session/action"

export function newPasswordResetSessionComponent(): PasswordResetSessionComponent {
    return initPasswordResetSessionComponent({
        passwordResetSession: initPasswordResetSessionAction({
            timeConfig: newTimeConfig(),
            passwordResetSessionClient: newPasswordResetSessionClient(),
        }),
        loginIDField: initLoginIDFieldAction(),
    })
}

export function newWorkerHelper(): PasswordResetSessionWorkerComponentHelper {
    return initPasswordResetSessionWorkerComponentHelper()
}

function newPasswordResetSessionClient(): PasswordResetSessionClient {
    //return initFetchPasswordResetSessionClient(initAuthClient(env.authServerURL))
    return initSimulatePasswordResetSessionClient({ loginID: "loginID" })
}
