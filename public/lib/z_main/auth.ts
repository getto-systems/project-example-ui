import { initAuthClient, AuthClient } from "../z_external/auth_client/auth_client"

import { initStorageAuthCredentialRepository } from "../credential/impl/repository/credential/storage"
import { initFetchRenewClient } from "../credential/impl/client/renew/fetch"
import { initSimulateCheckClient } from "../script/impl/client/check/simulate"
import { initFetchPasswordLoginClient } from "../password_login/impl/client/password_login/fetch"
import { initSimulatePasswordResetSessionClient } from "../password_reset_session/impl/client/password_reset_session/simulate"
import { initSimulatePasswordResetClient } from "../password_reset/impl/client/password_reset/simulate"
import { env } from "../y_static/env"

import { initAuthCredentialAction } from "../credential/impl/core"
import { initScriptAction } from "../script/impl/core"
import { initPasswordAction } from "../password/impl/core"
import { initPasswordLoginAction } from "../password_login/impl/core"
import { initPasswordResetSessionAction } from "../password_reset_session/impl/core"
import { initPasswordResetAction } from "../password_reset/impl/core"

import { AuthUsecase, initAuthUsecase } from "../auth"
import { AuthAction } from "../auth/action"

import { AuthCredentialRepository, RenewClient } from "../credential/infra"
import { CheckClient } from "../script/infra"
import { PasswordLoginClient } from "../password_login/infra"
import { PasswordResetSessionClient } from "../password_reset_session/infra"
import { PasswordResetClient } from "../password_reset/infra"

export function init(): AuthUsecase {
    const backbone = {
        currentLocation: location,
        storage: localStorage,
    }

    return initAuthUsecase(backbone.currentLocation, initAuthAction())

    function initAuthAction(): AuthAction {
        const config = initConfig()
        const authClient = initAuthClient(env.authServerURL)

        return {
            authCredential: initAuthCredentialAction({
                config,
                authCredentials: initAuthCredentialRepository(),
                renewClient: initRenewClient(authClient),
            }),
            script: initScriptAction({
                config,
                checkClient: initCheckClient(),
            }),
            password: initPasswordAction(),

            passwordLogin: initPasswordLoginAction({
                config,
                passwordLoginClient: initPasswordLoginClient(authClient),
            }),
            passwordResetSession: initPasswordResetSessionAction({
                config,
                passwordResetSessionClient: initPasswordResetSessionClient(),
            }),
            passwordReset: initPasswordResetAction({
                config,
                passwordResetClient: initPasswordResetClient(),
            }),
        }
    }

    function initConfig(): Config {
        return {
            secureServerHost: env.secureServerHost,

            renewDelayTime: delaySecond(0.5),

            passwordLoginDelayTime: delaySecond(1),

            passwordResetCreateSessionDelayTime: delaySecond(1),
            passwordResetPollingWaitTime: waitSecond(0.25),
            passwordResetPollingLimit: { limit: 40 },

            passwordResetDelayTime: delaySecond(1),
        }
    }

    function initAuthCredentialRepository(): AuthCredentialRepository {
        return initStorageAuthCredentialRepository(backbone.storage, "GETTO-EXAMPLE-CREDENTIAL")
    }

    function initRenewClient(authClient: AuthClient): RenewClient {
        return initFetchRenewClient(authClient)
    }
    function initPasswordLoginClient(authClient: AuthClient): PasswordLoginClient {
        return initFetchPasswordLoginClient(authClient)
    }
    function initPasswordResetSessionClient(): PasswordResetSessionClient {
        return initSimulatePasswordResetSessionClient({ loginID: "admin" })
    }
    function initPasswordResetClient(): PasswordResetClient {
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

    function initCheckClient(): CheckClient {
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
