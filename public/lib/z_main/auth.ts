import { initAuthClient, AuthClient } from "../z_external/auth_client/auth_client"

import { initAuthUsecase, initAuthUsecaseEventHandler } from "../auth/core"

import { initFetchCredentialComponent } from "../auth/fetch_credential/core"
import { initRenewCredentialComponent } from "../auth/renew_credential/core"
import { initStoreCredentialComponent } from "../auth/store_credential/core"

import { initLoginIDFieldComponent } from "../auth/field/login_id/core"
import { initPasswordFieldComponent } from "../auth/field/password/core"

import { initPasswordLoginComponent } from "../auth/password_login/core"
import { initPasswordResetComponent, initPasswordResetComponentEvent } from "../auth/password_reset/core"
import { initPasswordResetSessionComponent, initPasswordResetSessionComponentEvent } from "../auth/password_reset_session/core"

import { initStorageAuthCredentialRepository } from "../credential/impl/repository/credential/storage"
import { initFetchRenewClient } from "../renew_credential/impl/client/renew/fetch"
import { initSimulateCheckClient } from "../script/impl/client/check/simulate"
import { initFetchPasswordLoginClient } from "../password_login/impl/client/password_login/fetch"
import { initSimulatePasswordResetSessionClient } from "../password_reset_session/impl/client/password_reset_session/simulate"
import { initSimulatePasswordResetClient } from "../password_reset/impl/client/password_reset/simulate"
import { env } from "../y_static/env"

import { initCredentialAction } from "../credential/impl/core"
import { initRenewCredentialAction } from "../renew_credential/impl/core"
import { initLoginIDFieldAction } from "../field/login_id/impl/core"
import { initPasswordFieldAction } from "../field/password/impl/core"
import { initPasswordLoginAction } from "../password_login/impl/core"
import { initPasswordResetSessionAction } from "../password_reset_session/impl/core"
import { initPasswordResetAction } from "../password_reset/impl/core"

import { AuthCredentialRepository } from "../credential/infra"
import { RenewClient } from "../renew_credential/infra"
import { CheckClient } from "../script/infra"
import { PasswordLoginClient } from "../password_login/infra"
import { PasswordResetSessionClient } from "../password_reset_session/infra"
import { PasswordResetClient } from "../password_reset/infra"

import { FetchCredentialComponentAction } from "../auth/fetch_credential/action"
import { RenewCredentialComponentAction } from "../auth/renew_credential/action"
import { StoreCredentialComponentAction } from "../auth/store_credential/action"

import { LoginIDFieldComponentAction } from "../auth/field/login_id/action"
import { PasswordFieldComponentAction } from "../auth/field/password/action"

import { PasswordLoginComponentAction, PasswordLoginComponent } from "../auth/password_login/action"
import { PasswordResetSessionComponentAction, PasswordResetSessionComponent, PasswordResetSessionComponentEventInit } from "../auth/password_reset_session/action"
import { PasswordResetComponentAction, PasswordResetComponent, PasswordResetComponentEventInit } from "../auth/password_reset/action"

import { CredentialAction } from "../credential/action"
import { RenewCredentialAction } from "../renew_credential/action"

import { LoginIDFieldAction } from "../field/login_id/action"
import { PasswordFieldAction } from "../field/password/action"

import { PasswordLoginAction } from "../password_login/action"
import { PasswordResetSessionAction } from "../password_reset_session/action"
import { PasswordResetAction } from "../password_reset/action"

import { AuthUsecase, AuthUsecaseEventHandler } from "../auth/data"
import { FetchCredentialComponent } from "../auth/fetch_credential/data"
import { RenewCredentialComponent } from "../auth/renew_credential/data"
import { StoreCredentialComponent } from "../auth/store_credential/data"
import { LoginIDFieldComponent } from "../auth/field/login_id/data"
import { PasswordFieldComponent } from "../auth/field/password/data"

import { ResetToken } from "../password_reset/data"

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

    initAuthUsecase(): [AuthUsecase, AuthUsecaseEventHandler] {
        return [
            initAuthUsecase(this.currentLocation, {
                fetchCredential: this.initFetchCredentialComponent(),
                renewCredential: this.initRenewCredentialComponent(),
                storeCredential: this.initStoreCredentialComponent(),
            }),
            initAuthUsecaseEventHandler(this.currentLocation),
        ]
    }

    initFetchCredentialComponent(): FetchCredentialComponent {
        return initFetchCredentialComponent(this.initFetchCredentialComponentAction())
    }
    initRenewCredentialComponent(): RenewCredentialComponent {
        return initRenewCredentialComponent(this.initRenewCredentialComponentAction())
    }
    initStoreCredentialComponent(): StoreCredentialComponent {
        return initStoreCredentialComponent(this.initStoreCredentialComponentAction())
    }

    initPasswordLoginComponent(): PasswordLoginComponent {
        return initPasswordLoginComponent(
            this.initPasswordLoginComponentAction(),
            {
                loginID: this.initLoginIDFieldComponent(),
                password: this.initPasswordFieldComponent(),
            }
        )
    }

    initPasswordResetSession(): PasswordResetSessionComponent {
        return initPasswordResetSessionComponent(
            this.initLoginIDFieldComponent(),
            this.initPasswordResetSessionComponentAction(),
        )
    }
    initPasswordResetSessionEvent(): PasswordResetSessionComponentEventInit {
        return initPasswordResetSessionComponentEvent()
    }

    initPasswordReset(resetToken: ResetToken): PasswordResetComponent {
        return initPasswordResetComponent(
            this.initLoginIDFieldComponent(),
            this.initPasswordFieldComponent(),
            this.initPasswordResetComponentAction(),
            resetToken,
        )
    }
    initPasswordResetEvent(handler: AuthUsecaseEventHandler): PasswordResetComponentEventInit {
        return initPasswordResetComponentEvent(handler)
    }

    initLoginIDFieldComponent(): LoginIDFieldComponent {
        return initLoginIDFieldComponent(this.initLoginIDFieldComponentAction())
    }
    initPasswordFieldComponent(): PasswordFieldComponent {
        return initPasswordFieldComponent(this.initPasswordFieldComponentAction())
    }

    initFetchCredentialComponentAction(): FetchCredentialComponentAction {
        return {
            credential: this.initCredentialAction(),
        }
    }
    initRenewCredentialComponentAction(): RenewCredentialComponentAction {
        return {
            renewCredential: this.initRenewCredentialAction(),
        }
    }
    initStoreCredentialComponentAction(): StoreCredentialComponentAction {
        return {
            credential: this.initCredentialAction(),
        }
    }

    initLoginIDFieldComponentAction(): LoginIDFieldComponentAction {
        return {
            loginIDField: this.initLoginIDFieldAction(),
        }
    }
    initPasswordFieldComponentAction(): PasswordFieldComponentAction {
        return {
            passwordField: this.initPasswordFieldAction(),
        }
    }

    initPasswordLoginComponentAction(): PasswordLoginComponentAction {
        return {
            passwordLogin: this.initPasswordLoginAction(),
        }
    }
    initPasswordResetSessionComponentAction(): PasswordResetSessionComponentAction {
        return {
            passwordResetSession: this.initPasswordResetSessionAction(),
        }
    }
    initPasswordResetComponentAction(): PasswordResetComponentAction {
        return {
            credential: this.initCredentialAction(),
            passwordReset: this.initPasswordResetAction(),
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

    initLoginIDFieldAction(): LoginIDFieldAction {
        return initLoginIDFieldAction()
    }
    initPasswordFieldAction(): PasswordFieldAction {
        return initPasswordFieldAction()
    }

    initPasswordLoginAction(): PasswordLoginAction {
        return initPasswordLoginAction({
            config: this.config,
            passwordLoginClient: this.initPasswordLoginClient(),
        })
    }
    initPasswordResetSessionAction(): PasswordResetSessionAction {
        return initPasswordResetSessionAction({
            config: this.config,
            passwordResetSessionClient: this.initPasswordResetSessionClient(),
        })
    }
    initPasswordResetAction(): PasswordResetAction {
        return initPasswordResetAction({
            config: this.config,
            passwordResetClient: this.initPasswordResetClient(),
        })
    }

    initAuthCredentialRepository(): AuthCredentialRepository {
        return initStorageAuthCredentialRepository(this.credentialStorage, "GETTO-EXAMPLE-CREDENTIAL")
    }
    initRenewClient(): RenewClient {
        return initFetchRenewClient(this.authClient)
    }
    initPasswordLoginClient(): PasswordLoginClient {
        return initFetchPasswordLoginClient(this.authClient)
    }
    initPasswordResetSessionClient(): PasswordResetSessionClient {
        return initSimulatePasswordResetSessionClient({ loginID: "admin" })
    }
    initPasswordResetClient(): PasswordResetClient {
        return initSimulatePasswordResetClient(
            { loginID: "admin" },
            {
                ticketNonce: { ticketNonce: "ticket-nonce" },
                apiCredential: {
                    apiRoles: { apiRoles: ["admin", "development"] },
                },
            },
        )
    }

    initCheckClient(): CheckClient {
        // TODO ちゃんとした実装を用意
        return initSimulateCheckClient({ success: true })
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
