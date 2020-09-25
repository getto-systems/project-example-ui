import { env } from "../y_static/env"

import { initAuthClient } from "../z_external/auth_client/auth_client"

import { newTimeConfig } from "./auth/config"

import { newLoadApplicationComponent } from "./auth/worker/load_application"
import { newPasswordLoginComponent } from "./auth/worker/password_login"
import { newPasswordResetSessionComponent } from "./auth/worker/password_reset_session"
import { newPasswordResetComponent } from "./auth/worker/password_reset"

import { initAuthUsecase } from "../auth/impl/core"
import { initStorageAuthCredentialRepository } from "../auth/impl/repository/auth_credential/storage"

import { initRenewCredentialComponent } from "../auth/component/renew_credential/impl"

import { initStorageAuthCredentialRepository as initCredentialRepository } from "../credential/impl/repository/credential/storage"
import { initFetchRenewClient } from "../credential/impl/client/renew/fetch"

import { initCredentialAction } from "../credential/impl/core"

import { AuthCredentialRepository, RenewClient } from "../credential/infra"

import { AuthUsecase } from "../auth/usecase"

import { CredentialAction } from "../credential/action"

export function newAuthUsecase(currentLocation: Location): AuthUsecase {
    const credential = newCredentialAction()

    return initAuthUsecase({
        authCredentials: initStorageAuthCredentialRepository(localStorage, {
            ticketNonce: "GETTO-EXAMPLE-TICKET-NONCE",
            apiCredential: "GETTO-EXAMPLE-API-CREDENTIAL",
        }),
    }, currentLocation, {
        renewCredential: initRenewCredentialComponent({ credential }),
        loadApplication: newLoadApplicationComponent(),

        passwordLogin: newPasswordLoginComponent(),
        passwordResetSession: newPasswordResetSessionComponent(),
        passwordReset: newPasswordResetComponent(),
    })
}

function getCredentialStorage(): Storage {
    return localStorage
}

function newCredentialAction(): CredentialAction {
    return initCredentialAction({
        timeConfig: newTimeConfig(),
        renewClient: newRenewClient(),
        authCredentials: newAuthCredentialRepository(),
    })
}

function newAuthCredentialRepository(): AuthCredentialRepository {
    return initCredentialRepository(getCredentialStorage(), {
        ticketNonce: "GETTO-EXAMPLE-TICKET-NONCE",
        apiCredential: "GETTO-EXAMPLE-API-CREDENTIAL",
    })
}
function newRenewClient(): RenewClient {
    return initFetchRenewClient(initAuthClient(env.authServerURL))
}
