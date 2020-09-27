import { delayed, wait } from "../../../z_external/delayed"

import { newTimeConfig } from "../config"

import { initPasswordResetAction } from "../../../password_reset/impl/core"

import { initSimulatePasswordResetSessionClient } from "../../../password_reset/impl/client/password_reset_session/simulate"
import { initSimulatePasswordResetClient } from "../../../password_reset/impl/client/password_reset/simulate"

import { PasswordResetSessionClient, PasswordResetClient } from "../../../password_reset/infra"

import { packTicketNonce, packApiRoles, packAuthAt } from "../../../credential/adapter"

import { packLoginID } from "../../../login_id/adapter"

import { PasswordResetAction } from "../../../password_reset/action"

export function newPasswordResetAction(): PasswordResetAction {
    return initPasswordResetAction({
        timeConfig: newTimeConfig(),
        passwordResetSessionClient: newPasswordResetSessionClient(),
        passwordResetClient: newPasswordResetClient(),
        delayed,
        wait,
    })
}

function newPasswordResetSessionClient(): PasswordResetSessionClient {
    //return initFetchPasswordResetSessionClient(initAuthClient(env.authServerURL))
    return initSimulatePasswordResetSessionClient(packLoginID("loginID"))
}

function newPasswordResetClient(): PasswordResetClient {
    //return initFetchPasswordResetClient(initAuthClient(env.authServerURL))
    return initSimulatePasswordResetClient(
        packLoginID("loginID"),
        {
            ticketNonce: packTicketNonce("ticket-nonce"),
            apiCredential: {
                apiRoles: packApiRoles(["admin", "dev"]),
            },
            authAt: packAuthAt(new Date()),
        },
    )
}
