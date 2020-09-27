import { env } from "../y_static/env"
import { delayed } from "../z_external/delayed"

import { initAuthClient } from "../z_external/auth_client/auth_client"

import { newTimeConfig, TimeConfig } from "./auth/config"

import { newAppHref } from "./href"

import { newLoadApplicationComponent } from "./auth/load_application"
import { newPasswordLoginComponent } from "./auth/worker/password_login"
import { newPasswordResetSessionComponent } from "./auth/worker/password_reset_session"
import { newPasswordResetComponent } from "./auth/worker/password_reset"

import { initAuthUsecase } from "../auth/impl/core"
import { initAuthLocation } from "../auth/impl/location"
import { initAuthExpires } from "../auth/impl/expires"
import { initRenewRunner } from "../auth/impl/renew_runner"
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
    const timeConfig = newTimeConfig()

    return initAuthUsecase(newAppHref(), {
        renewCredential: newRenewCredentialComponent(timeConfig),
        loadApplication: newLoadApplicationComponent(),

        passwordLogin: newPasswordLoginComponent(),
        passwordResetSession: newPasswordResetSessionComponent(),
        passwordReset: newPasswordResetComponent(),
    }, {
        timeConfig,
        param: {
            renewCredential: packRenewCredentialParam,
            loadApplication: packLoadApplicationParam,
            passwordReset: packPasswordResetParam,
        },
        authLocation: initAuthLocation(currentLocation),
        authCredentials: initStorageAuthCredentialRepository(credentialStorage, {
            ticketNonce: "GETTO-EXAMPLE-TICKET-NONCE",
            apiCredential: "GETTO-EXAMPLE-API-CREDENTIAL",
            lastAuthAt: "GETTO-EXAMPLE-LAST-AUTH-AT",
        }),
        expires: initAuthExpires(),
        runner: initRenewRunner(),
    })
}

function newRenewCredentialComponent(timeConfig: TimeConfig): RenewCredentialComponent {
    return initRenewCredentialComponent({ credential: newCredentialAction(timeConfig) })
}

function newCredentialAction(timeConfig: TimeConfig): CredentialAction {
    return initCredentialAction({
        timeConfig,
        renewClient: newRenewClient(),
        delayed,
    })
}

function newRenewClient(): RenewClient {
    return initFetchRenewClient(initAuthClient(env.authServerURL))
}
