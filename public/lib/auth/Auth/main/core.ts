import { delayed, wait } from "../../../z_external/delayed"
import { initAuthClient, AuthClient } from "../../../z_external/auth_client/auth_client"

import { env } from "../../../y_static/env"

import { newAppHref } from "../../Href/main"
import { TimeConfig, newTimeConfig, newHostConfig } from "./config"

import { initAuthViewFactoryAsSingle } from "../impl/single"
import { initAuthViewFactoryAsForeground } from "../impl/worker/foreground"
import { initAuthWorkerAsBackground } from "../impl/worker/background"

import { initRenewCredential } from "../component/renew_credential/impl"
import { initPasswordLogin } from "../component/password_login/impl"
import { initPasswordResetSession } from "../component/password_reset_session/impl"
import { initPasswordReset } from "../component/password_reset/impl"

import { initLoginIDField } from "../component/field/login_id/impl"
import { initPasswordField } from "../component/field/password/impl"

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

import { AuthViewFactory } from "../view"
import { currentPagePathname, detectLoginView, detectResetToken } from "../impl/view"

import { markTicketNonce, markAuthAt, markApiCredential } from "../../credential/data"
import { markLoginID } from "../../login_id/data"

export type AuthViewProps = Readonly<{
    credentialStorage: Storage
    currentLocation: Location
}>

export function newAuthViewFactoryAsSingle(props: AuthViewProps): AuthViewFactory {
    const { credentialStorage, currentLocation } = props

    const config = {
        time: newTimeConfig(),
    }

    const client = {
        auth: initAuthClient(env.authServerURL),
    }

    const factory = {
        actions: {
            application: newApplicationFactory(),
            credential: newCredentialFactory(config.time, credentialStorage, client.auth),

            passwordLogin: newPasswordLoginFactory(config.time, client.auth),
            passwordReset: newPasswordResetFactory(config.time),

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

    return initAuthViewFactoryAsSingle(factory, collector)
}
export function newAuthViewFactoryAsWorkerForeground(props: AuthViewProps): AuthViewFactory {
    const { credentialStorage, currentLocation } = props

    const config = {
        time: newTimeConfig(),
    }

    const client = {
        auth: initAuthClient(env.authServerURL),
    }

    const worker = new Worker("./auth.worker.js")

    const factory = {
        actions: {
            application: newApplicationFactory(),
            credential: newCredentialFactory(config.time, credentialStorage, client.auth),

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

    return initAuthViewFactoryAsForeground(worker, factory, collector)
}
export function initAuthWorker(worker: Worker): void {
    const config = {
        time: newTimeConfig(),
    }

    const client = {
        auth: initAuthClient(env.authServerURL),
    }

    const actions = {
        passwordLogin: newPasswordLoginFactory(config.time, client.auth),
        passwordReset: newPasswordResetFactory(config.time),
    }

    return initAuthWorkerAsBackground(actions, worker)
}

function newApplicationFactory() {
    return {
        secureScriptPath: secureScriptPath({ host: newHostConfig() }),
    }
}
function newCredentialFactory(time: TimeConfig, credentialStorage: Storage, authClient: AuthClient) {
    const authCredentials = initStorageAuthCredentialRepository(credentialStorage, env.storageKey)

    return {
        renew: renew({
            time,

            authCredentials,
            client: newRenewClient(authClient),
            delayed,

            expires: initAuthExpires(),
        }),
        setContinuousRenew: setContinuousRenew({
            time,

            authCredentials,
            client: newRenewClient(authClient),

            runner: initRenewRunner(),
        }),
        store: store({ authCredentials }),
    }
}
function newPasswordLoginFactory(time: TimeConfig, authClient: AuthClient) {
    return {
        login: login({
            client: newPasswordLoginClient(authClient),
            time,
            delayed,
        }),
    }
}
function newPasswordResetFactory(time: TimeConfig) {
    const sessionClient = newPasswordResetSessionClient()

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
            client: newPasswordResetClient(),
            time,
            delayed,
        }),
    }
}

function newRenewClient(authClient: AuthClient) {
    return initFetchRenewClient(authClient)
}
function newPasswordLoginClient(authClient: AuthClient) {
    return initFetchPasswordLoginClient(authClient)
}
function newPasswordResetSessionClient() {
    //return initFetchPasswordResetSessionClient(authClient)
    return initSimulatePasswordResetSessionClient(markLoginID("loginID"))
}
function newPasswordResetClient() {
    //return initFetchPasswordResetClient(authClient)
    return initSimulatePasswordResetClient(markLoginID("loginID"), {
        ticketNonce: markTicketNonce("ticket-nonce"),
        apiCredential: markApiCredential({
            apiRoles: ["admin", "dev"],
        }),
        authAt: markAuthAt(new Date()),
    })
}
