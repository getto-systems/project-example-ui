import { env } from "../y_static/env"

import { initAuthClient } from "../z_external/auth_client/auth_client"

import { newTimeConfig } from "./auth/config"

import { newLoadApplicationComponent } from "./auth/worker/load_application"
import { newPasswordLoginComponent } from "./auth/worker/password_login"
import { newPasswordResetSessionComponent } from "./auth/worker/password_reset_session"
import { newPasswordResetComponent } from "./auth/worker/password_reset"

import { initAuthUsecase } from "../auth/impl/core"
import { initAuthLocation } from "../auth/impl/location"
import { initStorageAuthCredentialRepository } from "../auth/impl/repository/auth_credential/storage"

import { initRenewCredentialComponent } from "../auth/component/renew_credential/impl"

import { initFetchRenewClient } from "../credential/impl/client/renew/fetch"

import { initCredentialAction } from "../credential/impl/core"

import { RenewClient } from "../credential/infra"

import { AuthUsecase } from "../auth/usecase"
import { RenewCredentialComponent } from "../auth/component/renew_credential/component"

import { CredentialAction } from "../credential/action"

export function newAuthUsecase(currentLocation: Location, credentialStorage: Storage): AuthUsecase {
    return initAuthUsecase({
        authLocation: initAuthLocation(currentLocation),
        authCredentials: initStorageAuthCredentialRepository(credentialStorage, {
            ticketNonce: "GETTO-EXAMPLE-TICKET-NONCE",
            apiCredential: "GETTO-EXAMPLE-API-CREDENTIAL",
        }),
    }, {
        renewCredential: newRenewCredentialComponent(),
        loadApplication: newLoadApplicationComponent(),

        passwordLogin: newPasswordLoginComponent(),
        passwordResetSession: newPasswordResetSessionComponent(),
        passwordReset: newPasswordResetComponent(),
    })
}

function newRenewCredentialComponent(): RenewCredentialComponent {
    return initRenewCredentialComponent({ credential: newCredentialAction() })
}

function newCredentialAction(): CredentialAction {
    return initCredentialAction({
        timeConfig: newTimeConfig(),
        renewClient: newRenewClient(),
    })
}

function newRenewClient(): RenewClient {
    return initFetchRenewClient(initAuthClient(env.authServerURL))
}
