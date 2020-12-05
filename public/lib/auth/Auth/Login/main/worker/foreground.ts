import { delayed } from "../../../../../z_external/delayed"
import { initAuthClient, AuthClient } from "../../../../../z_external/auth_client/auth_client"

import { env } from "../../../../../y_static/env"

import { TimeConfig, newTimeConfig, newHostConfig } from "../../impl/config"

import { initLoginAsForeground } from "../../impl/worker/foreground"

import { initLoginLink } from "../../impl/link"

import { initRenewCredential } from "../../../renew_credential/impl"
import { initPasswordLogin } from "../../../password_login/impl"
import { initPasswordResetSession } from "../../../password_reset_session/impl"
import { initPasswordReset } from "../../../password_reset/impl"

import { initLoginIDField } from "../../../field/login_id/impl"
import { initPasswordField } from "../../../field/password/impl"

import { secureScriptPath } from "../../../../common/application/impl/core"
import { renew, setContinuousRenew, store } from "../../../../login/renew/impl/core"

import { loginIDField } from "../../../../common/field/login_id/impl/core"
import { passwordField } from "../../../../common/field/password/impl/core"

import { initFetchRenewClient } from "../../../../login/renew/impl/client/renew/fetch"
import { initAuthExpires } from "../../../../login/renew/impl/expires"
import { initRenewRunner } from "../../../../login/renew/impl/renew_runner"
import { initStorageAuthCredentialRepository } from "../../../../login/renew/impl/repository/auth_credential/storage"

import { currentPagePathname, detectViewState, detectResetToken } from "../../impl/location"

import { LoginFactory } from "../../view"

export function newLoginAsWorkerForeground(): LoginFactory {
    const credentialStorage = localStorage
    const currentURL = new URL(location.toString())

    const time = newTimeConfig()
    const authClient = initAuthClient(env.authServerURL)

    const worker = new Worker(`/${env.version}/login.worker.js`)

    const factory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(),
            credential: initCredentialAction(time, credentialStorage, authClient),

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
