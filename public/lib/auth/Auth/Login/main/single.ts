import { delayed, wait } from "../../../../z_external/delayed"
import { initAuthClient, AuthClient } from "../../../../z_external/auth_client/auth_client"

import { env } from "../../../../y_static/env"

import { TimeConfig, newTimeConfig, newHostConfig } from "../impl/config"

import { initLoginAsSingle } from "../impl/single"

import { initLoginLink } from "../impl/link"

import { initRenewCredential } from "../../renew_credential/impl"
import { initPasswordLogin } from "../../password_login/impl"
import { initPasswordResetSession } from "../../password_reset_session/impl"
import { initPasswordReset } from "../../password_reset/impl"

import { initLoginIDField } from "../../field/login_id/impl"
import { initPasswordField } from "../../field/password/impl"

import { secureScriptPath } from "../../../common/application/impl/core"
import { renew, setContinuousRenew, store } from "../../../login/renew/impl/core"
import { login } from "../../../login/password_login/impl/core"
import { startSession, checkStatus, reset } from "../../../profile/password_reset/impl/core"

import { loginIDField } from "../../../common/field/login_id/impl/core"
import { passwordField } from "../../../common/field/password/impl/core"

import { initFetchRenewClient } from "../../../login/renew/impl/client/renew/fetch"
import { initAuthExpires } from "../../../login/renew/impl/expires"
import { initRenewRunner } from "../../../login/renew/impl/renew_runner"
import { initStorageAuthCredentialRepository } from "../../../login/renew/impl/repository/auth_credential/storage"
import { initFetchPasswordLoginClient } from "../../../login/password_login/impl/client/login/fetch"
import { initSimulatePasswordResetClient } from "../../../profile/password_reset/impl/client/reset/simulate"
import { initSimulatePasswordResetSessionClient } from "../../../profile/password_reset/impl/client/session/simulate"

import { currentPagePathname, detectViewState, detectResetToken } from "../impl/location"

import { LoginFactory } from "../view"

import { markTicketNonce, markLoginAt, markApiCredential } from "../../../common/credential/data"
import { markSessionID } from "../../../profile/password_reset/data"

export function newLoginAsSingle(): LoginFactory {
    const credentialStorage = localStorage
    const currentURL = new URL(location.toString())

    const time = newTimeConfig()
    const authClient = initAuthClient(env.authServerURL)

    const factory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(),
            credential: initCredentialAction(time, credentialStorage, authClient),

            passwordLogin: initPasswordLoginAction(time, authClient),
            passwordReset: initPasswordResetAction(time),

            field: {
                loginID: loginIDField,
                password: passwordField,
            },
        },
        components: {
            renewCredential: initRenewCredential,

            passwordLogin: initPasswordLogin,
            passwordResetSession: initPasswordResetSession,
            passwordReset: initPasswordReset,

            field: {
                loginID: initLoginIDField,
                password: initPasswordField,
            },
        },
    }
    const collector = {
        login: {
            getLoginView: () => detectViewState(currentURL),
        },
        application: {
            getPagePathname: () => currentPagePathname(currentURL),
        },
        passwordReset: {
            getResetToken: () => detectResetToken(currentURL),
        },
    }

    return () => initLoginAsSingle(factory, collector)
}

function initApplicationAction() {
    return {
        secureScriptPath: secureScriptPath({ host: newHostConfig() }),
    }
}
function initCredentialAction(time: TimeConfig, credentialStorage: Storage, authClient: AuthClient) {
    const authCredentials = initStorageAuthCredentialRepository(credentialStorage, env.storageKey)
    const client = initFetchRenewClient(authClient)

    return {
        renew: renew({
            authCredentials,
            client,
            time,
            delayed,
            expires: initAuthExpires(),
        }),
        setContinuousRenew: setContinuousRenew({
            authCredentials,
            client,
            time,
            runner: initRenewRunner(),
        }),
        store: store({ authCredentials }),
    }
}
function initPasswordLoginAction(time: TimeConfig, authClient: AuthClient) {
    return {
        login: login({
            client: initFetchPasswordLoginClient(authClient),
            time,
            delayed,
        }),
    }
}
function initPasswordResetAction(time: TimeConfig) {
    const targetLoginID = "loginID"
    const targetSessionID = markSessionID("session-id")
    const targetResetToken = "reset-token"

    const sessionClient = initSimulatePasswordResetSessionClient({
        // エラーにする場合は StartSessionError を throw (それ以外を throw するとこわれる)
        async startSession({ loginID }) {
            if (loginID !== targetLoginID) {
                throw { type: "invalid-password-reset" }
            }
            return targetSessionID
        },
        // エラーにする場合は CheckStatusError を throw (それ以外を throw するとこわれる)
        async sendToken(post) {
            setTimeout(() => post({ state: "waiting" }), 0.3 * 1000)
            setTimeout(() => post({ state: "sending" }), 0.6 * 1000)
            setTimeout(() => post({ state: "success" }), 0.9 * 1000)
            return true
        },
        // エラーにする場合は CheckStatusError を throw (それ以外を throw するとこわれる)
        async getDestination(sessionID) {
            if (sessionID != targetSessionID) {
                throw { type: "invalid-password-reset" }
            }
            return { type: "log" }
        },
    })
    const resetClient = initSimulatePasswordResetClient({
        // エラーにする場合は ResetError を throw (それ以外を throw するとこわれる)
        async reset(resetToken, { loginID }) {
            if (resetToken !== targetResetToken) {
                throw { type: "invalid-password-reset" }
            }
            if (loginID !== targetLoginID) {
                throw { type: "invalid-password-reset" }
            }
            return {
                ticketNonce: markTicketNonce("ticket-nonce"),
                apiCredential: markApiCredential({
                    apiRoles: ["admin", "dev"],
                }),
                loginAt: markLoginAt(new Date()),
            }
        },
    })

    return {
        startSession: startSession({
            client: sessionClient,
            time,
            delayed,
        }),
        checkStatus: checkStatus({
            client: sessionClient,
            time,
            delayed,
            wait,
        }),
        reset: reset({
            client: resetClient,
            time,
            delayed,
        }),
    }
}
