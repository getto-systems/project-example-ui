import { newTimeConfig } from "../config"

import { initPasswordResetAction } from "../../../password_reset/impl/core"

import { initSimulatePasswordResetSessionClient } from "../../../password_reset/impl/client/password_reset_session/simulate"
import { initSimulatePasswordResetClient } from "../../../password_reset/impl/client/password_reset/simulate"

import { PasswordResetSessionClient, PasswordResetClient } from "../../../password_reset/infra"

import { PasswordResetAction } from "../../../password_reset/action"

export function newPasswordResetAction(): PasswordResetAction {
    return initPasswordResetAction({
        timeConfig: newTimeConfig(),
        passwordResetSessionClient: newPasswordResetSessionClient(),
        passwordResetClient: newPasswordResetClient(),
    })
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
