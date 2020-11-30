import { delayed, wait } from "../../../z_external/delayed"
import { initAuthClient, AuthClient } from "../../../z_external/auth_client/auth_client"

import { env } from "../../../y_static/env"

import { newAppHref } from "../../Href/main"
import { TimeConfig, newTimeConfig, newHostConfig } from "./impl/config"

import { initAuthAsSingle } from "./impl/single"
import { initAuthAsForeground } from "./impl/worker/foreground"
import { initAuthWorkerAsBackground } from "./impl/worker/background"

import { initRenewCredential } from "../renew_credential/impl"
import { initPasswordLogin } from "../password_login/impl"
import { initPasswordResetSession } from "../password_reset_session/impl"
import { initPasswordReset } from "../password_reset/impl"

import { initLoginIDField } from "../field/login_id/impl"
import { initPasswordField } from "../field/password/impl"

import { secureScriptPath } from "../../application/impl/core"
import { renew, setContinuousRenew, store } from "../../credential/impl/core"
import { login } from "../../password_login/impl/core"
import { startSession, checkStatus, reset } from "../../password_reset/impl/core"

import { loginIDField } from "../../login_id/field/impl/core"
import { passwordField } from "../../password/field/impl/core"

import { initFetchRenewClient } from "../../credential/impl/client/renew/fetch"
import { initAuthExpires } from "../../credential/impl/expires"
import { initRenewRunner } from "../../credential/impl/renew_runner"
import { initStorageAuthCredentialRepository } from "../../credential/impl/repository/auth_credential/storage"
import { initFetchPasswordLoginClient } from "../../password_login/impl/client/login/fetch"
import { initSimulatePasswordResetClient } from "../../password_reset/impl/client/reset/simulate"
import { initSimulatePasswordResetSessionClient } from "../../password_reset/impl/client/session/simulate"

import { currentPagePathname, detectLoginView, detectResetToken } from "./impl/location"

import { AuthFactory } from "./view"

import { markTicketNonce, markAuthAt, markApiCredential } from "../../credential/data"
import { markLoginID } from "../../login_id/data"

export function newAuthAsSingle(): AuthFactory {
    const credentialStorage = localStorage
    const currentLocation = location

    const config = {
        time: newTimeConfig(),
    }

    const client = {
        auth: initAuthClient(env.authServerURL),
    }

    const factory = {
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
            href: newAppHref,

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
        auth: {
            getLoginView: () => detectLoginView(currentLocation),
        },
        application: {
            getPagePathname: () => currentPagePathname(currentLocation),
        },
        passwordReset: {
            getResetToken: () => detectResetToken(currentLocation),
        },
    }

    return () => initAuthAsSingle(factory, collector)
}
export function newAuthAsWorkerForeground(): AuthFactory {
    const credentialStorage = localStorage
    const currentLocation = location

    const config = {
        time: newTimeConfig(),
    }

    const client = {
        auth: initAuthClient(env.authServerURL),
    }

    const worker = new Worker("./auth.worker.js")

    const factory = {
        actions: {
            application: initApplicationAction(),
            credential: initCredentialAction(config.time, credentialStorage, client.auth),

            field: {
                loginID: () => loginIDField(),
                password: () => passwordField(),
            },
        },
        components: {
            href: newAppHref,

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
        auth: {
            getLoginView: () => detectLoginView(currentLocation),
        },
        application: {
            getPagePathname: () => currentPagePathname(currentLocation),
        },
        passwordReset: {
            getResetToken: () => detectResetToken(currentLocation),
        },
    }

    return () => initAuthAsForeground(worker, factory, collector)
}
export function initAuthWorker(worker: Worker): void {
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

    return initAuthWorkerAsBackground(actions, worker)
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
        authAt: markAuthAt(new Date()),
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
