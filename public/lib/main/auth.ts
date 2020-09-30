import { env } from "../y_static/env"
import { delayed } from "../z_external/delayed"

import { initAuthClient } from "../z_external/auth_client/auth_client"

import { newTimeConfig, newHostConfig } from "./auth/config"

import { newAppHref } from "./href"

import { newApplicationComponent } from "./auth/application"
import { newPasswordLoginComponent } from "./auth/worker/password_login"
import { newPasswordResetSessionComponent } from "./auth/worker/password_reset_session"
import { newPasswordResetComponent } from "./auth/worker/password_reset"

import { initAuthUsecase } from "../auth/impl/core"

import { initBackgroundCredentialComponent } from "../background/credential/impl"

import { initCredentialComponent, packCredentialParam } from "../auth/component/credential/impl"
import { packApplicationParam } from "../auth/component/application/impl"
import { packPasswordResetParam } from "../auth/component/password_reset/impl"

import { initFetchRenewClient } from "../credential/impl/client/renew/fetch"
import { initAuthExpires } from "../credential/impl/expires"
import { initRenewRunner } from "../credential/impl/renew_runner"
import { initStorageAuthCredentialRepository } from "../credential/impl/repository/auth_credential/storage"

import { initCredentialAction } from "../credential/impl/core"
import { initApplicationAction } from "../application/impl/core"

import { RenewClient } from "../credential/infra"

import { AuthUsecase } from "../auth/usecase"
import { BackgroundCredentialComponentResource } from "../background/credential/component"
import { CredentialComponent } from "../auth/component/credential/component"

import { CredentialAction } from "../credential/action"
import { ApplicationAction } from "../application/action"

export function newAuthUsecase(currentLocation: Location, credentialStorage: Storage): AuthUsecase {
    const credential = newCredentialResources(credentialStorage)

    const request = {
        credential: credential.request,
    }

    return initAuthUsecase({
        currentLocation,
        href: newAppHref(),
        param: {
            credential: packCredentialParam,
            application: packApplicationParam,
            passwordReset: packPasswordResetParam,
        },
        component: {
            credential: credential.component,
            application: newApplicationComponent(),

            passwordLogin: newPasswordLoginComponent(request),
            passwordResetSession: newPasswordResetSessionComponent(),
            passwordReset: newPasswordResetComponent(request),
        },
        background: {
            credential: credential.background,
        },
    })
}

function newCredentialResources(credentialStorage: Storage) {
    const credentialAction = newCredentialAction(credentialStorage)

    return {
        component: newCredentialComponent(credentialAction),
        ...newBackgroundCredentialComponent(credentialAction),
    }
}


function newBackgroundCredentialComponent(credential: CredentialAction): BackgroundCredentialComponentResource {
    return initBackgroundCredentialComponent({
        credential,
    })
}
function newCredentialComponent(credential: CredentialAction): CredentialComponent {
    return initCredentialComponent({
        credential,
        application: newApplicationAction(),
    })
}

function newCredentialAction(credentialStorage: Storage): CredentialAction {
    return initCredentialAction({
        timeConfig: newTimeConfig(),

        authCredentials: initStorageAuthCredentialRepository(credentialStorage, env.storageKey),
        expires: initAuthExpires(),
        runner: initRenewRunner(),

        renewClient: newRenewClient(),
        delayed,
    })
}

function newApplicationAction(): ApplicationAction {
    return initApplicationAction({
        hostConfig: newHostConfig(),
    })
}

function newRenewClient(): RenewClient {
    return initFetchRenewClient(initAuthClient(env.authServerURL))
}
