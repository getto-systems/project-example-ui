import { delayed } from "../../../../../z_external/delayed"
import { initAuthClient, AuthClient } from "../../../../../z_external/auth_client/auth_client"

import { env } from "../../../../../y_static/env"

import {
    newApplicationActionConfig,
    newRenewActionConfig,
    newSetContinuousRenewActionConfig,
} from "../../impl/config"

import { Collector, ForegroundFactory, initLoginAsForeground } from "../../impl/worker/foreground"

import { initLoginLink } from "../../impl/link"

import { initRenewCredential } from "../../../renew_credential/impl"
import { initPasswordLogin } from "../../../password_login/impl"
import { initPasswordResetSession } from "../../../password_reset_session/impl"
import { initPasswordReset } from "../../../password_reset/impl"

import { initLoginIDField } from "../../../field/login_id/impl"
import { initPasswordField } from "../../../field/password/impl"

import { secureScriptPath } from "../../../../common/application/impl/core"
import { renew, setContinuousRenew } from "../../../../login/renew/impl/core"

import { loginIDField } from "../../../../common/field/login_id/impl/core"
import { passwordField } from "../../../../common/field/password/impl/core"

import { initFetchRenewClient } from "../../../../login/renew/impl/client/renew/fetch"
import { initAuthExpires } from "../../../../login/renew/impl/expires"
import { initRenewRunner } from "../../../../login/renew/impl/renew_runner"
import { initStorageAuthCredentialRepository } from "../../../../login/renew/impl/repository/auth_credential/storage"

import { currentPagePathname, detectViewState, detectResetToken } from "../../impl/location"

import { AuthCredentialRepository } from "../../../../login/renew/infra"
import { ApplicationActionConfig } from "../../../../common/application/infra"
import { RenewActionConfig, SetContinuousRenewActionConfig } from "../../../../login/renew/infra"

import { LoginFactory } from "../../view"

import { ApplicationAction } from "../../../../common/application/action"
import { RenewAction, SetContinuousRenewAction } from "../../../../login/renew/action"

export function newLoginAsWorkerForeground(): LoginFactory {
    const credentialStorage = localStorage
    const currentURL = new URL(location.toString())

    const authClient = initAuthClient(env.authServerURL)

    const worker = new Worker(`/${env.version}/login.worker.js`)

    const authCredentials = initAuthCredentialRepository(credentialStorage)

    const factory: ForegroundFactory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(newApplicationActionConfig()),
            renew: initRenewAction(newRenewActionConfig(), authCredentials, authClient),
            setContinuousRenew: initSetContinuousRenewAction(
                newSetContinuousRenewActionConfig(),
                authCredentials,
                authClient
            ),

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

    const collector: Collector = {
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

    return () => initLoginAsForeground(worker, factory, collector)
}

export function initApplicationAction(config: ApplicationActionConfig): ApplicationAction {
    return {
        secureScriptPath: secureScriptPath({ config: config.secureScriptPath }),
    }
}
export function initAuthCredentialRepository(credentialStorage: Storage): AuthCredentialRepository {
    return initStorageAuthCredentialRepository(credentialStorage, env.storageKey)
}
export function initRenewAction(
    config: RenewActionConfig,
    authCredentials: AuthCredentialRepository,
    authClient: AuthClient
): RenewAction {
    const client = initFetchRenewClient(authClient)

    return {
        renew: renew({
            authCredentials,
            client,
            config: config.renew,
            delayed,
            expires: initAuthExpires(),
        }),
    }
}
export function initSetContinuousRenewAction(
    config: SetContinuousRenewActionConfig,
    authCredentials: AuthCredentialRepository,
    authClient: AuthClient
): SetContinuousRenewAction {
    const client = initFetchRenewClient(authClient)

    return {
        setContinuousRenew: setContinuousRenew({
            authCredentials,
            client,
            config: config.setContinuousRenew,
            runner: initRenewRunner(),
        }),
    }
}
