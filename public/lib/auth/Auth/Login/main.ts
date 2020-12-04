import { delayed, wait } from "../../../z_external/delayed"
import { initAuthClient, AuthClient } from "../../../z_external/auth_client/auth_client"

import { env } from "../../../y_static/env"

import { TimeConfig, newTimeConfig, newHostConfig } from "./impl/config"

import { initLoginAsSingle } from "./impl/single"
import { initLoginAsForeground } from "./impl/worker/foreground"
import { initLoginWorkerAsBackground } from "./impl/worker/background"

import { initLoginLink } from "./impl/link"

import { initRenewCredential } from "../renew_credential/impl"
import { initPasswordLogin } from "../password_login/impl"
import { initPasswordResetSession } from "../password_reset_session/impl"
import { initPasswordReset } from "../password_reset/impl"

import { initLoginIDField } from "../field/login_id/impl"
import { initPasswordField } from "../field/password/impl"

import { secureScriptPath } from "../../common/application/impl/core"
import { renew, setContinuousRenew, store } from "../../login/renew/impl/core"
import { login } from "../../login/password_login/impl/core"
import { startSession, checkStatus, reset } from "../../profile/password_reset/impl/core"

import { loginIDField } from "../../common/field/login_id/impl/core"
import { passwordField } from "../../common/field/password/impl/core"

import { initFetchRenewClient } from "../../login/renew/impl/client/renew/fetch"
import { initAuthExpires } from "../../login/renew/impl/expires"
import { initRenewRunner } from "../../login/renew/impl/renew_runner"
import { initStorageAuthCredentialRepository } from "../../login/renew/impl/repository/auth_credential/storage"
import { initFetchPasswordLoginClient } from "../../login/password_login/impl/client/login/fetch"
import { initSimulatePasswordResetClient } from "../../profile/password_reset/impl/client/reset/simulate"
import { initSimulatePasswordResetSessionClient } from "../../profile/password_reset/impl/client/session/simulate"

import { currentPagePathname, detectViewState, detectResetToken } from "./impl/location"

import { LoginFactory } from "./view"

import { markTicketNonce, markLoginAt, markApiCredential } from "../../common/credential/data"
import { markLoginID } from "../../common/login_id/data"

export function newLoginAsSingle(): LoginFactory {
    const credentialStorage = localStorage
    const currentLocation = location

    const config = {
        time: newTimeConfig(),
    }

    const client = {
        auth: initAuthClient(env.authServerURL),
    }

    const factory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(),
            credential: initCredentialAction(config.time, credentialStorage, client.auth),

            passwordLogin: initPasswordLoginAction(config.time, client.auth),
            passwordReset: initPasswordResetAction(config.time),

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
            getLoginView: () => detectViewState(currentLocation),
        },
        application: {
            getPagePathname: () => currentPagePathname(currentLocation),
        },
        passwordReset: {
            getResetToken: () => detectResetToken(currentLocation),
        },
    }

    return () => initLoginAsSingle(factory, collector)
}
export function newLoginAsWorkerForeground(): LoginFactory {
    const credentialStorage = localStorage
    const currentLocation = location

    const config = {
        time: newTimeConfig(),
    }

    const client = {
        auth: initAuthClient(env.authServerURL),
    }

    const worker = new Worker(`/${env.version}/login.worker.js`)

    const factory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(),
            credential: initCredentialAction(config.time, credentialStorage, client.auth),

            field: {
                loginID: () => loginIDField(),
                password: () => passwordField(),
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
            getLoginView: () => detectViewState(currentLocation),
        },
        application: {
            getPagePathname: () => currentPagePathname(currentLocation),
        },
        passwordReset: {
            getResetToken: () => detectResetToken(currentLocation),
        },
    }

    return () => initLoginAsForeground(worker, factory, collector)
}
export function initLoginWorker(worker: Worker): void {
    const config = {
        time: newTimeConfig(),
    }

    const client = {
        auth: initAuthClient(env.authServerURL),
    }

    const actions = {
        passwordLogin: initPasswordLoginAction(config.time, client.auth),
        passwordReset: initPasswordResetAction(config.time),
    }

    return initLoginWorkerAsBackground(actions, worker)
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
            time,

            authCredentials,
            client,
            delayed,

            expires: initAuthExpires(),
        }),
        setContinuousRenew: setContinuousRenew({
            time,

            authCredentials,
            client,

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
    const sessionClient = initSimulatePasswordResetSessionClient(markLoginID("loginID"))
    const resetClient = initSimulatePasswordResetClient(markLoginID("loginID"), {
        ticketNonce: markTicketNonce("ticket-nonce"),
        apiCredential: markApiCredential({
            apiRoles: ["admin", "dev"],
        }),
        loginAt: markLoginAt(new Date()),
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
