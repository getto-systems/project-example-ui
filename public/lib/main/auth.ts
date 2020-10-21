import { delayed, wait } from "../z_external/delayed"
import { initAuthClient } from "../z_external/auth_client/auth_client"

import { env } from "../y_static/env"

import { TimeConfig, newTimeConfig, newHostConfig } from "./auth/config"

import { newAppHref } from "./href"

import { initAuthInit } from "../auth/impl/core"

import { initRenewCredential } from "../auth/component/renew_credential/impl"
import { initPasswordLogin } from "../auth/component/password_login/impl"
import { initPasswordResetSession } from "../auth/component/password_reset_session/impl"
import { initPasswordReset } from "../auth/component/password_reset/impl"

import { initLoginIDField } from "../auth/component/field/login_id/impl"
import { initPasswordField } from "../auth/component/field/password/impl"

import { initSecureScriptPathAction } from "../application/impl/core"
import { initRenewAction, initSetContinousRenewAction, initStoreAction } from "../credential/impl/core"
import { initLoginAction } from "../password_login/impl/core"
import { initStartSessionAction, initPollingStatusAction, initResetAction } from "../password_reset/impl/core"

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

import { AuthInit, AuthInitWorker } from "../auth/view"

import { LoginFieldCollector } from "../password_login/action"
import { StartSessionFieldCollector, ResetFieldCollector } from "../password_reset/action"

export function newAuthInit(credentialStorage: Storage): AuthInit {
    const config = {
        time: newTimeConfig(),
    }

    const factory = {
        application: newApplicationFactory(),
        credential: newCredentialFactory(config.time, credentialStorage),

        passwordLogin: newPasswordLoginFactory(config.time),
        passwordReset: newPasswordResetFactory(config.time),

        field: {
            loginID: () => initLoginIDFieldAction(),
            password: () => initPasswordFieldAction(),
        },
    }

    const init = {
        href: newAppHref,

        renewCredential: initRenewCredential,

        passwordLogin: initPasswordLogin,
        passwordResetSession: initPasswordResetSession,
        passwordReset: initPasswordReset,

        field: {
            loginID: initLoginIDField,
            password: initPasswordField,
        }
    }

    return initAuthInit(factory, init)
}
export function newAuthInitWorker(): AuthInitWorker {
    /*
    const config = {
        time: newTimeConfig(),
    }

    const factory = {
        application: newApplicationFactory(),

        passwordLogin: newPasswordLoginFactory(config.time),
        passwordReset: newPasswordResetFactory(config.time),

        field: {
            loginID: () => initLoginIDFieldAction(),
            password: () => initPasswordFieldAction(),
        },
    }

    const init = {
        passwordLogin: initPasswordLogin,
        passwordResetSession: initPasswordResetSession,
        passwordReset: initPasswordReset,

        field: {
            loginID: initLoginIDField,
            password: initPasswordField,
        }
    }
     */

    return (_worker) => {
        //initAuthWorker(factory, init, worker)
    }
}

function newApplicationFactory() {
    return {
        secureScriptPath: () => initSecureScriptPathAction({ host: newHostConfig() }),
    }
}
function newCredentialFactory(time: TimeConfig, credentialStorage: Storage) {
    const authCredentials = initStorageAuthCredentialRepository(credentialStorage, env.storageKey)

    return {
        renew: () => initRenewAction({
            time,

            authCredentials,
            client: newRenewClient(),
            delayed,

            expires: initAuthExpires(),
        }),
        setContinuousRenew: () => initSetContinousRenewAction({
            time,

            authCredentials,
            client: newRenewClient(),

            runner: initRenewRunner(),
        }),
        store: () => initStoreAction({
            authCredentials,
        }),
    }
}
function newPasswordLoginFactory(time: TimeConfig) {
    return {
        login: (fields: LoginFieldCollector) => initLoginAction(fields, {
            client: newPasswordLoginClient(),
            time,
            delayed,
        }),
    }
}
function newPasswordResetFactory(time: TimeConfig) {
    const sessionClient = newPasswordResetSessionClient()

    return {
        startSession: (fields: StartSessionFieldCollector) => initStartSessionAction(fields, {
            client: sessionClient,
            time,
            delayed,
        }),
        pollingStatus: () => initPollingStatusAction({
            client: sessionClient,
            time,
            delayed,
            wait,
        }),
        reset: (fields: ResetFieldCollector) => initResetAction(fields, {
            client: newPasswordResetClient(),
            time,
            delayed,
        }),
    }
}

function newRenewClient() {
    return initFetchRenewClient(initAuthClient(env.authServerURL))
}
function newPasswordLoginClient() {
    return initFetchPasswordLoginClient(initAuthClient(env.authServerURL))
}
function newPasswordResetSessionClient() {
    //return initFetchPasswordResetSessionClient(initAuthClient(env.authServerURL))
    return initSimulatePasswordResetSessionClient(packLoginID("loginID"))
}
function newPasswordResetClient() {
    //return initFetchPasswordResetClient(initAuthClient(env.authServerURL))
    return initSimulatePasswordResetClient(
        packLoginID("loginID"),
        {
            ticketNonce: packTicketNonce("ticket-nonce"),
            apiCredential: {
                apiRoles: packApiRoles(["admin", "dev"]),
            },
            authAt: packAuthAt(new Date()),
        },
    )
}
