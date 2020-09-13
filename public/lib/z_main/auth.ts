import { initAuthClient, AuthClient } from "../z_external/auth_client/auth_client"

import { initAuthComponent, initAuthComponentEvent } from "../auth/impl/core"

import { initRenewComponent, initRenewComponentEvent } from "../auth/renew/impl/core"

import { initLoginIDFieldComponent, initLoginIDFieldComponentEvent } from "../auth/field/login_id/impl/core"
import { initPasswordFieldComponent, initPasswordFieldComponentEvent } from "../auth/field/password/impl/core"

import { initPasswordLoginComponent, initPasswordLoginComponentEvent } from "../auth/password_login/impl/core"
import { initPasswordResetComponent, initPasswordResetComponentEvent } from "../auth/password_reset/impl/core"
import { initPasswordResetSessionComponent, initPasswordResetSessionComponentEvent } from "../auth/password_reset_session/impl/core"

import { initStorageAuthCredentialRepository } from "../credential/impl/repository/credential/storage"
import { initFetchRenewClient } from "../credential/impl/client/renew/fetch"
import { initSimulateCheckClient } from "../script/impl/client/check/simulate"
import { initFetchPasswordLoginClient } from "../password_login/impl/client/password_login/fetch"
import { initSimulatePasswordResetSessionClient } from "../password_reset_session/impl/client/password_reset_session/simulate"
import { initSimulatePasswordResetClient } from "../password_reset/impl/client/password_reset/simulate"
import { env } from "../y_static/env"

import { initCredentialAction } from "../credential/impl/core"
import { initPasswordAction } from "../password/impl/core"
import { initPasswordLoginAction } from "../password_login/impl/core"
import { initPasswordResetSessionAction } from "../password_reset_session/impl/core"
import { initPasswordResetAction } from "../password_reset/impl/core"

import { AuthComponent, AuthComponentEvent, AuthComponentEventInit } from "../auth/action"

import { AuthCredentialRepository, RenewClient } from "../credential/infra"
import { CheckClient } from "../script/infra"
import { PasswordLoginClient } from "../password_login/infra"
import { PasswordResetSessionClient } from "../password_reset_session/infra"
import { PasswordResetClient } from "../password_reset/infra"

import { RenewComponentAction, RenewComponent, RenewComponentEventInit } from "../auth/renew/action"

import { LoginIDFieldComponentAction, LoginIDFieldComponent, LoginIDFieldComponentEventInit } from "../auth/field/login_id/action"
import { PasswordFieldComponentAction, PasswordFieldComponent, PasswordFieldComponentEventInit } from "../auth/field/password/action"

import { PasswordLoginComponentAction, PasswordLoginComponent, PasswordLoginComponentEventInit } from "../auth/password_login/action"
import { PasswordResetSessionComponentAction, PasswordResetSessionComponent, PasswordResetSessionComponentEventInit } from "../auth/password_reset_session/action"
import { PasswordResetComponentAction, PasswordResetComponent, PasswordResetComponentEventInit } from "../auth/password_reset/action"

import { CredentialAction } from "../credential/action"

import { PasswordAction } from "../password/action"

import { PasswordLoginAction } from "../password_login/action"
import { PasswordResetSessionAction } from "../password_reset_session/action"
import { PasswordResetAction } from "../password_reset/action"

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

    initAuthComponent(): [AuthComponent, AuthComponentEventInit] {
        return [
            initAuthComponent(this.currentLocation),
            initAuthComponentEvent(this.currentLocation),
        ]
    }

    initRenewComponent(): RenewComponent {
        return initRenewComponent(this.initRenewComponentAction())
    }
    initRenewComponentEvent(event: AuthComponentEvent): RenewComponentEventInit {
        return initRenewComponentEvent(event)
    }

    initPasswordLoginComponent(): PasswordLoginComponent {
        return initPasswordLoginComponent(
            this.initLoginIDFieldComponent(),
            this.initPasswordFieldComponent(),
            this.initPasswordLoginComponentAction(),
        )
    }
    initPasswordLoginComponentEvent(event: AuthComponentEvent): PasswordLoginComponentEventInit {
        return initPasswordLoginComponentEvent(event)
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
    initPasswordResetEvent(event: AuthComponentEvent): PasswordResetComponentEventInit {
        return initPasswordResetComponentEvent(event)
    }

    initLoginIDFieldComponent(): [LoginIDFieldComponent, LoginIDFieldComponentEventInit] {
        return [
            initLoginIDFieldComponent(this.initLoginIDFieldComponentAction()),
            initLoginIDFieldComponentEvent(),
        ]
    }
    initPasswordFieldComponent(): [PasswordFieldComponent, PasswordFieldComponentEventInit] {
        return [
            initPasswordFieldComponent(this.initPasswordFieldComponentAction()),
            initPasswordFieldComponentEvent(),
        ]
    }

    initRenewComponentAction(): RenewComponentAction {
        return {
            credential: this.initCredentialAction(),
        }
    }

    initLoginIDFieldComponentAction(): LoginIDFieldComponentAction {
        return {
            credential: this.initCredentialAction(),
        }
    }
    initPasswordFieldComponentAction(): PasswordFieldComponentAction {
        return {
            password: this.initPasswordAction(),
        }
    }

    initPasswordLoginComponentAction(): PasswordLoginComponentAction {
        return {
            credential: this.initCredentialAction(),
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
            config: this.config,
            authCredentials: this.initAuthCredentialRepository(),
            renewClient: this.initRenewClient(),
        })
    }

    initPasswordAction(): PasswordAction {
        return initPasswordAction()
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
