import { env } from "../y_static/env"
import { delayed } from "../z_external/delayed"

import { initAuthClient } from "../z_external/auth_client/auth_client"

import { newTimeConfig, newHostConfig } from "./auth/config"

import { newAppHref } from "./href"

import { newApplicationComponent } from "./auth/application"
import { newPasswordResetSessionComponent } from "./auth/worker/password_reset_session"
import { newPasswordResetComponent } from "./auth/worker/password_reset"

import { initAuthUsecase } from "../auth/impl/core"

import { initBackgroundCredentialComponent } from "../background/credential/impl"

import { initCredentialComponent, packCredentialParam } from "../auth/component/credential/impl"
import { packApplicationParam } from "../auth/component/application/impl"
import { packPasswordResetParam } from "../auth/component/password_reset/impl"

import { initPasswordLoginComponent } from "../auth/component/password_login/impl"

import { initFetchRenewClient } from "../credential/impl/client/renew/fetch"
import { initAuthExpires } from "../credential/impl/expires"
import { initRenewRunner } from "../credential/impl/renew_runner"
import { initStorageAuthCredentialRepository } from "../credential/impl/repository/auth_credential/storage"

import { initCredentialAction } from "../credential/impl/core"
import { initApplicationAction } from "../application/impl/core"

import { initFetchPasswordLoginClient } from "../password_login/impl/client/password_login/fetch"

import { initPasswordLoginInit } from "../password_login/impl/core"

import { RenewClient } from "../credential/infra"
import { PasswordLoginClient } from "../password_login/infra"

import { AuthUsecase } from "../auth/usecase"

import { CredentialAction } from "../credential/action"
import { ApplicationAction } from "../application/action"

import { PasswordLoginInit } from "../password_login/action"

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

            passwordLogin: () => initPasswordLoginComponent(request),
            passwordResetSession: newPasswordResetSessionComponent(),
            passwordReset: newPasswordResetComponent(request),
        },
        background: {
            credential: credential.background,
        },
        action: {
            passwordLogin: newPasswordLoginInit,
        },
    })
}

function newPasswordLoginInit(): PasswordLoginInit {
    return initPasswordLoginInit({
        timeConfig: newTimeConfig(),
        passwordLoginClient: newPasswordLoginClient(),
        delayed,
    })
}

function newCredentialResources(credentialStorage: Storage) {
    const credential = newCredentialAction(credentialStorage)

    return {
        component: initCredentialComponent({
            credential,
            application: newApplicationAction(),
        }),
        ...initBackgroundCredentialComponent({
            credential,
        }),
    }
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
function newPasswordLoginClient(): PasswordLoginClient {
    return initFetchPasswordLoginClient(initAuthClient(env.authServerURL))
}
