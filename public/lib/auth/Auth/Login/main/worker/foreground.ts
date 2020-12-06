import { delayed } from "../../../../../z_external/delayed"
import { initAuthClient, AuthClient } from "../../../../../z_external/auth_client/auth_client"

import { env } from "../../../../../y_static/env"

import { TimeConfig, newTimeConfig, newHostConfig, HostConfig } from "../../impl/config"

import { ForegroundFactory, initLoginAsForeground } from "../../impl/worker/foreground"

import { initLoginLink } from "../../impl/link"

import { initRenewCredential } from "../../../renew_credential/impl"
import { initPasswordLogin } from "../../../password_login/impl"
import { initPasswordResetSession } from "../../../password_reset_session/impl"
import { initPasswordReset } from "../../../password_reset/impl"

import { initLoginIDField } from "../../../field/login_id/impl"
import { initPasswordField } from "../../../field/password/impl"

import { secureScriptPath } from "../../../../common/application/impl/core"
import {
    loadLastLogin,
    removeAuthCredential,
    storeAuthCredential,
} from "../../../../common/credential/impl/core"
import { renew, setContinuousRenew } from "../../../../login/renew/impl/core"

import { loginIDField } from "../../../../common/field/login_id/impl/core"
import { passwordField } from "../../../../common/field/password/impl/core"

import { initFetchRenewClient } from "../../../../login/renew/impl/client/renew/fetch"
import { initAuthExpires } from "../../../../login/renew/impl/expires"
import { initRenewRunner } from "../../../../login/renew/impl/renew_runner"
import { initStorageAuthCredentialRepository } from "../../../../common/credential/impl/repository/auth_credential/storage"

import { currentPagePathname, detectViewState, detectResetToken } from "../../impl/location"

import { LoginFactory } from "../../view"
import { ApplicationAction } from "../../../../common/application/action"
import { CredentialAction } from "../../../../common/credential/action"
import { RenewAction } from "../../../../login/renew/action"

export function newLoginAsWorkerForeground(): LoginFactory {
    const credentialStorage = localStorage
    const currentURL = new URL(location.toString())

    const host = newHostConfig()
    const time = newTimeConfig()
    const authClient = initAuthClient(env.authServerURL)

    const worker = new Worker(`/${env.version}/login.worker.js`)

    const factory: ForegroundFactory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(host),
            credential: initCredentialAction(credentialStorage),
            renew: initRenewAction(time, authClient),

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

function initApplicationAction(host: HostConfig): ApplicationAction {
    return {
        secureScriptPath: secureScriptPath({ host: host.secureScriptPath }),
    }
}
function initCredentialAction(credentialStorage: Storage): CredentialAction {
    const authCredentials = initStorageAuthCredentialRepository(credentialStorage, env.storageKey)

    return {
        storeAuthCredential: storeAuthCredential({ authCredentials }),
        removeAuthCredential: removeAuthCredential({ authCredentials }),
        loadLastLogin: loadLastLogin({ authCredentials }),
    }
}
function initRenewAction(time: TimeConfig, authClient: AuthClient): RenewAction {
    const client = initFetchRenewClient(authClient)

    return {
        renew: renew({
            client,
            time: time.renew,
            delayed,
            expires: initAuthExpires(),
        }),
        setContinuousRenew: setContinuousRenew({
            client,
            time: time.setContinuousRenew,
            runner: initRenewRunner(),
        }),
    }
}
