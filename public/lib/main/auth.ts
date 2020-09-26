import { env } from "../y_static/env"
import { delayed } from "../z_external/delayed"

import { initAuthClient } from "../z_external/auth_client/auth_client"

import { newTimeConfig } from "./auth/config"

import { newAppHref } from "./href"

import { newLoadApplicationComponent } from "./auth/worker/load_application"
import { newPasswordLoginComponent } from "./auth/worker/password_login"
import { newPasswordResetSessionComponent } from "./auth/worker/password_reset_session"
import { newPasswordResetComponent } from "./auth/worker/password_reset"

import { initAuthUsecase } from "../auth/impl/core"
import { initAuthLocation } from "../auth/impl/location"
import { initStorageAuthCredentialRepository } from "../auth/impl/repository/auth_credential/storage"

import { initRenewCredentialComponent, packRenewCredentialParam } from "../auth/component/renew_credential/impl"
import { packLoadApplicationParam } from "../auth/component/load_application/impl"
import { packPasswordResetParam } from "../auth/component/password_reset/impl"

import { initFetchRenewClient } from "../credential/impl/client/renew/fetch"

import { initCredentialAction } from "../credential/impl/core"

import { RenewClient } from "../credential/infra"

import { AuthUsecase } from "../auth/usecase"
import { RenewCredentialComponent } from "../auth/component/renew_credential/component"

import { CredentialAction } from "../credential/action"

export function newAuthUsecase(currentLocation: Location, credentialStorage: Storage): AuthUsecase {
    return initAuthUsecase(newAppHref(), {
        renewCredential: newRenewCredentialComponent(),
        loadApplication: newLoadApplicationComponent(),

        passwordLogin: newPasswordLoginComponent(),
        passwordResetSession: newPasswordResetSessionComponent(),
        passwordReset: newPasswordResetComponent(),
    }, {
        param: {
            renewCredential: packRenewCredentialParam,
            loadApplication: packLoadApplicationParam,
            passwordReset: packPasswordResetParam,
        },
        authLocation: initAuthLocation(currentLocation),
        authCredentials: initStorageAuthCredentialRepository(credentialStorage, {
            ticketNonce: "GETTO-EXAMPLE-TICKET-NONCE",
            apiCredential: "GETTO-EXAMPLE-API-CREDENTIAL",
        }),
    })
}

function newRenewCredentialComponent(): RenewCredentialComponent {
    return initRenewCredentialComponent({ credential: newCredentialAction() })
}

function newCredentialAction(): CredentialAction {
    return initCredentialAction({
        timeConfig: newTimeConfig(),
        renewClient: newRenewClient(),
        delayed,
    })
}

function newRenewClient(): RenewClient {
    return initFetchRenewClient(initAuthClient(env.authServerURL))
}
