import { env } from "../y_static/env"

import { initAuthClient } from "../z_external/auth_client/auth_client"

import { newTimeConfig } from "./auth/config"

import { newLoadApplicationComponent } from "./auth/worker/load_application"
import { newPasswordLoginComponent } from "./auth/worker/password_login"
import { newPasswordResetSessionComponent } from "./auth/worker/password_reset_session"
import { newPasswordResetComponent } from "./auth/worker/password_reset"

import { initAuthUsecase } from "../auth/impl"

import { initRenewCredentialComponent } from "../auth/renew_credential/impl"
import { initStoreCredentialComponent } from "../auth/store_credential/impl"

import { initStorageAuthCredentialRepository } from "../credential/impl/repository/credential/storage"
import { initFetchRenewClient } from "../credential/impl/client/renew/fetch"

import { initCredentialAction } from "../credential/impl/core"

import { AuthCredentialRepository, RenewClient } from "../credential/infra"

import { AuthUsecase } from "../auth/component"

import { CredentialAction } from "../credential/action"

export function newAuthUsecase(currentLocation: Location): AuthUsecase {
    const credential = newCredentialAction()

    return initAuthUsecase(currentLocation, {
        renewCredential: initRenewCredentialComponent({ credential }),
        storeCredential: initStoreCredentialComponent({ credential }),

        loadApplication: newLoadApplicationComponent(),

        passwordLogin: newPasswordLoginComponent(),
        passwordResetSession: newPasswordResetSessionComponent(),
        passwordReset: newPasswordResetComponent(),
    })
}

function getCredentialStorage(): [Storage, string] {
    return [localStorage, "GETTO-EXAMPLE-AUTH-CREDENTIAL"]
}

function newCredentialAction(): CredentialAction {
    return initCredentialAction({
        timeConfig: newTimeConfig(),
        renewClient: newRenewClient(),
        authCredentials: newAuthCredentialRepository(),
    })
}

function newAuthCredentialRepository(): AuthCredentialRepository {
    return initStorageAuthCredentialRepository(...getCredentialStorage())
}
function newRenewClient(): RenewClient {
    return initFetchRenewClient(initAuthClient(env.authServerURL))
}
