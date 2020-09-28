import { env } from "../y_static/env"
import { delayed } from "../z_external/delayed"

import { initAuthClient } from "../z_external/auth_client/auth_client"

import { newTimeConfig, newHostConfig } from "./auth/config"

import { newAppHref } from "./href"

import { newLoadApplicationComponent } from "./auth/load_application"
import { newPasswordLoginComponent } from "./auth/worker/password_login"
import { newPasswordResetSessionComponent } from "./auth/worker/password_reset_session"
import { newPasswordResetComponent } from "./auth/worker/password_reset"

import { initAuthUsecase } from "../auth/impl/core"

import { initStoreCredentialComponent } from "../background/store_credential/impl"

import { initRenewCredentialComponent, packRenewCredentialParam } from "../auth/component/renew_credential/impl"
import { packLoadApplicationParam } from "../auth/component/load_application/impl"
import { packPasswordResetParam } from "../auth/component/password_reset/impl"

import { initFetchRenewClient } from "../credential/impl/client/renew/fetch"
import { initAuthExpires } from "../credential/impl/expires"
import { initRenewRunner } from "../credential/impl/renew_runner"
import { initStorageAuthCredentialRepository } from "../credential/impl/repository/auth_credential/storage"

import { initCredentialAction } from "../credential/impl/core"
import { initScriptAction } from "../script/impl/core"

import { RenewClient } from "../credential/infra"

import { AuthUsecase } from "../auth/usecase"
import { StoreCredentialComponentResource } from "../background/store_credential/component"
import { RenewCredentialComponent } from "../auth/component/renew_credential/component"

import { CredentialAction } from "../credential/action"
import { ScriptAction } from "../script/action"

export function newAuthUsecase(currentLocation: Location, credentialStorage: Storage): AuthUsecase {
    const credential = newCredentialAction(credentialStorage)

    const store = newStoreCredentialComponent(credential)
    const renew = newRenewCredentialComponent(credential)

    return initAuthUsecase({
        currentLocation,
        href: newAppHref(),
        param: {
            renewCredential: packRenewCredentialParam,
            loadApplication: packLoadApplicationParam,
            passwordReset: packPasswordResetParam,
        },
        component: {
            renewCredential: renew,
            loadApplication: newLoadApplicationComponent(),

            passwordLogin: newPasswordLoginComponent(/* trigger */),
            passwordResetSession: newPasswordResetSessionComponent(),
            passwordReset: newPasswordResetComponent(),
        },
        background: {
            storeCredential: store.component,
        },
        /*
        send: {
            storeCredential: store.send,
        },
         */
    })
}

function newStoreCredentialComponent(credential: CredentialAction): StoreCredentialComponentResource {
    return initStoreCredentialComponent({
        credential,
    })
}
function newRenewCredentialComponent(credential: CredentialAction): RenewCredentialComponent {
    return initRenewCredentialComponent({
        credential,
        script: newScriptAction(),
    })
}

function newCredentialAction(credentialStorage: Storage): CredentialAction {
    return initCredentialAction({
        timeConfig: newTimeConfig(),

        authCredentials: initStorageAuthCredentialRepository(credentialStorage, {
            ticketNonce: "GETTO-EXAMPLE-TICKET-NONCE",
            apiCredential: "GETTO-EXAMPLE-API-CREDENTIAL",
            lastAuthAt: "GETTO-EXAMPLE-LAST-AUTH-AT",
        }),
        expires: initAuthExpires(),
        runner: initRenewRunner(),

        renewClient: newRenewClient(),
        delayed,
    })
}

function newScriptAction(): ScriptAction {
    return initScriptAction({
        hostConfig: newHostConfig(),
    })
}

function newRenewClient(): RenewClient {
    return initFetchRenewClient(initAuthClient(env.authServerURL))
}
