import { delayed, wait } from "../z_external/delayed"
import { initAuthClient, AuthClient } from "../z_external/auth_client/auth_client"

import { env } from "../y_static/env"

import { newAppHref } from "./href"
import { TimeConfig, newTimeConfig, newHostConfig } from "./auth/config"

import { initAuthViewFactoryAsSingle } from "../auth/impl/single"
import { initAuthViewFactoryAsForeground } from "../auth/impl/worker/foreground"
import { initAuthWorkerAsBackground } from "../auth/impl/worker/background"

import { initRenewCredential } from "../auth/component/renew_credential/impl"
import { initPasswordLogin } from "../auth/component/password_login/impl"
import { initPasswordResetSession } from "../auth/component/password_reset_session/impl"
import { initPasswordReset } from "../auth/component/password_reset/impl"

import { initLoginIDField } from "../auth/component/field/login_id/impl"
import { initPasswordField } from "../auth/component/field/password/impl"

import { initSecureScriptPathAction } from "../application/impl/core"
import { initRenewAction, initSetContinuousRenewAction, initStoreAction } from "../credential/impl/core"
import { initLoginAction } from "../password_login/impl/core"
import {
    initStartSessionAction,
    initPollingStatusAction,
    initResetAction,
} from "../password_reset/impl/core"

import { initLoginIDFieldAction } from "../login_id/field/impl/core"
import { initPasswordFieldAction } from "../password/field/impl/core"

import { initFetchRenewClient } from "../credential/impl/client/renew/fetch"
import { initAuthExpires } from "../credential/impl/expires"
import { initRenewRunner } from "../credential/impl/renew_runner"
import { initStorageAuthCredentialRepository } from "../credential/impl/repository/auth_credential/storage"
import { initFetchPasswordLoginClient } from "../password_login/impl/client/login/fetch"
import { initSimulatePasswordResetClient } from "../password_reset/impl/client/reset/simulate"
import { initSimulatePasswordResetSessionClient } from "../password_reset/impl/client/session/simulate"

import { packTicketNonce, packApiRoles, packAuthAt } from "../credential/adapter"
import { packLoginID } from "../login_id/adapter"

import { AuthViewFactory } from "../auth/view"

import { LoginFieldCollector } from "../password_login/action"
import { StartSessionFieldCollector, ResetFieldCollector } from "../password_reset/action"

export function newAuthViewFactoryAsSingle(credentialStorage: Storage): AuthViewFactory {
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
                loginID: () => initLoginIDFieldAction(),
                password: () => initPasswordFieldAction(),
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

    return initAuthViewFactoryAsSingle(factory)
}
export function newAuthViewFactoryAsWorkerForeground(credentialStorage: Storage): AuthViewFactory {
    const config = {
        time: newTimeConfig(),
    }

    const client = {
        auth: initAuthClient(env.authServerURL),
    }

    return initAuthViewFactoryAsForeground(new Worker("./auth.worker.js"), {
        actions: {
            application: newApplicationFactory(),
            credential: newCredentialFactory(config.time, credentialStorage, client.auth),

            field: {
                loginID: () => initLoginIDFieldAction(),
                password: () => initPasswordFieldAction(),
            },
        },
        components: {
            href: newAppHref,

            renewCredential: initRenewCredential,

            field: {
                loginID: initLoginIDField,
                password: initPasswordField,
            },
        },
    })
}
export function initAuthWorker(worker: Worker): void {
    const config = {
        time: newTimeConfig(),
    }

    const client = {
        auth: initAuthClient(env.authServerURL),
    }

    const factory = {
        actions: {
            application: newApplicationFactory(),

            passwordLogin: newPasswordLoginFactory(config.time, client.auth),
            passwordReset: newPasswordResetFactory(config.time),
        },
        components: {
            passwordLogin: initPasswordLogin,
            passwordResetSession: initPasswordResetSession,
            passwordReset: initPasswordReset,
        },
    }

    return initAuthWorkerAsBackground(factory, worker)
}

function newApplicationFactory() {
    return {
        secureScriptPath: () => initSecureScriptPathAction({ host: newHostConfig() }),
    }
}
function newCredentialFactory(time: TimeConfig, credentialStorage: Storage, authClient: AuthClient) {
    const authCredentials = initStorageAuthCredentialRepository(credentialStorage, env.storageKey)

    return {
        renew: () =>
            initRenewAction({
                time,

                authCredentials,
                client: newRenewClient(authClient),
                delayed,

                expires: initAuthExpires(),
            }),
        setContinuousRenew: () =>
            initSetContinuousRenewAction({
                time,

                authCredentials,
                client: newRenewClient(authClient),

                runner: initRenewRunner(),
            }),
        store: () =>
            initStoreAction({
                authCredentials,
            }),
    }
}
function newPasswordLoginFactory(time: TimeConfig, authClient: AuthClient) {
    return {
        login: (fields: LoginFieldCollector) =>
            initLoginAction(fields, {
                client: newPasswordLoginClient(authClient),
                time,
                delayed,
            }),
    }
}
function newPasswordResetFactory(time: TimeConfig) {
    const sessionClient = newPasswordResetSessionClient()

    return {
        startSession: (fields: StartSessionFieldCollector) =>
            initStartSessionAction(fields, {
                client: sessionClient,
                time,
                delayed,
            }),
        pollingStatus: () =>
            initPollingStatusAction({
                client: sessionClient,
                time,
                delayed,
                wait,
            }),
        reset: (fields: ResetFieldCollector) =>
            initResetAction(fields, {
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
    return initSimulatePasswordResetSessionClient(packLoginID("loginID"))
}
function newPasswordResetClient() {
    //return initFetchPasswordResetClient(authClient)
    return initSimulatePasswordResetClient(packLoginID("loginID"), {
        ticketNonce: packTicketNonce("ticket-nonce"),
        apiCredential: {
            apiRoles: packApiRoles(["admin", "dev"]),
        },
        authAt: packAuthAt(new Date()),
    })
}
