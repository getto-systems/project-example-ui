import { env } from "../y_static/env"

import { initAuthClient } from "../z_external/auth_client/auth_client"

import { newTimeConfig } from "./auth/config"

import { newLoadApplicationComponent } from "./auth/worker/load_application"
import { newPasswordLoginComponent } from "./auth/worker/password_login"
import { newPasswordResetSessionComponent } from "./auth/worker/password_reset_session"
import { newPasswordResetComponent } from "./auth/worker/password_reset"

import { initAuthUsecase } from "../auth/impl"

import { initFetchCredentialComponent } from "../auth/fetch_credential/impl"
import { initRenewCredentialComponent } from "../auth/renew_credential/impl"
import { initStoreCredentialComponent } from "../auth/store_credential/impl"

import { initStorageAuthCredentialRepository } from "../credential/impl/repository/credential/storage"
import { initFetchRenewClient } from "../credential/impl/client/renew/fetch"

import { initCredentialAction } from "../credential/impl/core"

import { AuthCredentialRepository, RenewClient } from "../credential/infra"

import { AuthUsecase } from "../auth/component"

import { CredentialAction } from "../credential/action"

export class ComponentLoader {
    initCredentialStorage: Init<Storage>

    constructor() {
        this.initCredentialStorage = () => localStorage
    }

    initAuthUsecase(currentLocation: Readonly<Location>): AuthUsecase {
        const credential = this.initCredentialAction()

        return initAuthUsecase(currentLocation, {
            fetchCredential: initFetchCredentialComponent({ credential }),
            renewCredential: initRenewCredentialComponent({ credential }),
            storeCredential: initStoreCredentialComponent({ credential }),
            loadApplication: newLoadApplicationComponent(),

            passwordLogin: newPasswordLoginComponent(),
            passwordResetSession: newPasswordResetSessionComponent(),
            passwordReset: newPasswordResetComponent(),
        })
    }

    initCredentialAction(): CredentialAction {
        return initCredentialAction({
            timeConfig: newTimeConfig(),
            renewClient: this.initRenewClient(),
            authCredentials: this.initAuthCredentialRepository(),
        })
    }

    initAuthCredentialRepository(): AuthCredentialRepository {
        return initStorageAuthCredentialRepository(this.initCredentialStorage(), "GETTO-EXAMPLE-CREDENTIAL")
    }
    initRenewClient(): RenewClient {
        return initFetchRenewClient(initAuthClient(env.authServerURL))
    }
}

interface Init<T> {
    (): T
}
