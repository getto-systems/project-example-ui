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

import { initPathFactory } from "../application/impl/core"
import { initRenewFactory, initStoreFactory } from "../credential/impl/core"
import { initLoginFactory } from "../password_login/impl/core"
import { initSessionFactory, initResetFactory } from "../password_reset/impl/core"

import { initLoginIDFieldFactory } from "../login_id/field/impl/core"
import { initPasswordFieldFactory } from "../password/field/impl/core"

import { initFetchRenewClient } from "../credential/impl/client/renew/fetch"
import { initAuthExpires } from "../credential/impl/expires"
import { initRenewRunner } from "../credential/impl/renew_runner"
import { initStorageAuthCredentialRepository } from "../credential/impl/repository/auth_credential/storage"
import { initFetchPasswordLoginClient } from "../password_login/impl/client/login/fetch"
import { initSimulatePasswordResetClient } from "../password_reset/impl/client/reset/simulate"
import { initSimulatePasswordResetSessionClient } from "../password_reset/impl/client/session/simulate"

import { packTicketNonce, packApiRoles, packAuthAt } from "../credential/adapter"
import { packLoginID } from "../login_id/adapter"

import { AuthInit } from "../auth/view"

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
            loginID: initLoginIDFieldFactory(),
            password: initPasswordFieldFactory(),
        },
    }

    const init = {
        href: () => newAppHref(),

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

function newApplicationFactory() {
    return {
        path: initPathFactory({ host: newHostConfig() }),
    }
}
function newCredentialFactory(time: TimeConfig, credentialStorage: Storage) {
    const authCredentials = initStorageAuthCredentialRepository(credentialStorage, env.storageKey)

    return {
        renew: initRenewFactory({
            time,

            authCredentials,
            renewClient: newRenewClient(),
            delayed,

            expires: initAuthExpires(),
            runner: initRenewRunner(),
        }),
        store: initStoreFactory({
            authCredentials,
        }),
    }
}
function newPasswordLoginFactory(time: TimeConfig) {
    return {
        login: initLoginFactory({
            time,
            passwordLoginClient: newPasswordLoginClient(),
            delayed,
        }),
    }
}
function newPasswordResetFactory(time: TimeConfig) {
    return {
        session: initSessionFactory({
            time,
            passwordResetSessionClient: newPasswordResetSessionClient(),
            delayed,
            wait,
        }),
        reset: initResetFactory({
            time,
            passwordResetClient: newPasswordResetClient(),
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
