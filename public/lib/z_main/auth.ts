import { initAuthClient, AuthClient } from "../z_external/auth_client/auth_client"

import { newLoadApplicationComponent } from "./auth/worker/load_application"
import { newPasswordLoginComponent } from "./auth/worker/password_login"
import { newPasswordResetSessionComponent } from "./auth/worker/password_reset_session"
import { newPasswordResetComponent } from "./auth/worker/password_reset"

import { initAuthUsecase } from "../auth/core"

import { initFetchCredentialComponent } from "../auth/fetch_credential/core"
import { initRenewCredentialComponent } from "../auth/renew_credential/core"
import { initStoreCredentialComponent } from "../auth/store_credential/core"

import { initStorageAuthCredentialRepository } from "../credential/impl/repository/credential/storage"
import { initFetchRenewClient } from "../renew_credential/impl/client/renew/fetch"
import { env } from "../y_static/env"

import { initCredentialAction } from "../credential/impl/core"
import { initRenewCredentialAction } from "../renew_credential/impl/core"

import { AuthCredentialRepository } from "../credential/infra"
import { RenewClient } from "../renew_credential/infra"

import { FetchCredentialComponentAction } from "../auth/fetch_credential/action"
import { RenewCredentialComponentAction } from "../auth/renew_credential/action"
import { StoreCredentialComponentAction } from "../auth/store_credential/action"

import { CredentialAction } from "../credential/action"
import { RenewCredentialAction } from "../renew_credential/action"

import { AuthUsecase } from "../auth/data"

export class ComponentLoader {
    currentLocation: Location
    credentialStorage: Storage

    authClient: AuthClient

    config: Config

    constructor() {
        this.currentLocation = location
        this.credentialStorage = localStorage

        this.authClient = initAuthClient(env.authServerURL)

        this.config = {
            secureServerHost: env.secureServerHost,

            renewDelayTime: delaySecond(0.5),

            passwordLoginDelayTime: delaySecond(1),

            passwordResetCreateSessionDelayTime: delaySecond(1),
            passwordResetPollingWaitTime: waitSecond(0.25),
            passwordResetPollingLimit: { limit: 40 },

            passwordResetDelayTime: delaySecond(1),
        }
    }

    initAuthUsecase(): AuthUsecase {
        const credentialAction = this.initCredentialAction()
        return initAuthUsecase(this.currentLocation, {
            fetchCredential: initFetchCredentialComponent(this.initFetchCredentialComponentAction(credentialAction)),
            renewCredential: initRenewCredentialComponent(this.initRenewCredentialComponentAction()),
            storeCredential: initStoreCredentialComponent(this.initStoreCredentialComponentAction(credentialAction)),
            loadApplication: newLoadApplicationComponent(),

            passwordLogin: newPasswordLoginComponent(),
            passwordResetSession: newPasswordResetSessionComponent(),
            passwordReset: newPasswordResetComponent(),
        })
    }

    initFetchCredentialComponentAction(credential: CredentialAction): FetchCredentialComponentAction {
        return { credential }
    }
    initStoreCredentialComponentAction(credential: CredentialAction): StoreCredentialComponentAction {
        return { credential }
    }

    initRenewCredentialComponentAction(): RenewCredentialComponentAction {
        return {
            renewCredential: this.initRenewCredentialAction(),
        }
    }

    initCredentialAction(): CredentialAction {
        return initCredentialAction({
            authCredentials: this.initAuthCredentialRepository(),
        })
    }
    initRenewCredentialAction(): RenewCredentialAction {
        return initRenewCredentialAction({
            timeConfig: this.config,
            renewClient: this.initRenewClient(),
        })
    }

    initAuthCredentialRepository(): AuthCredentialRepository {
        return initStorageAuthCredentialRepository(this.credentialStorage, "GETTO-EXAMPLE-CREDENTIAL")
    }
    initRenewClient(): RenewClient {
        return initFetchRenewClient(this.authClient)
    }
}

type Config = Readonly<{
    secureServerHost: string,

    renewDelayTime: DelayTime,

    passwordLoginDelayTime: DelayTime,

    passwordResetCreateSessionDelayTime: DelayTime,
    passwordResetPollingWaitTime: WaitTime,
    passwordResetPollingLimit: Limit,

    passwordResetDelayTime: DelayTime,
}>

type DelayTime = { delay_milli_second: number }
function delaySecond(second: number): DelayTime {
    return { delay_milli_second: second * 1000 }
}

type WaitTime = { wait_milli_second: number }
function waitSecond(second: number): WaitTime {
    return { wait_milli_second: second * 1000 }
}

type Limit = { limit: number }
