import { initAuthClient } from "../../../../z_external/auth_client/auth_client"

import { env } from "../../../../y_static/env"

import { initApplicationAction, initAuthCredentialRepository, initCredentialAction, initRenewAction, initStoreCredentialAction } from "./worker/foreground"
import {
    initPasswordLoginAction,
    initPasswordResetAction,
    initPasswordResetSessionAction,
} from "./worker/background"

import { newTimeConfig, newHostConfig } from "../impl/config"
import { Collector, Factory, initLoginAsSingle } from "../impl/single"
import { initLoginLink } from "../impl/link"

import { initRenewCredential } from "../../renew_credential/impl"
import { initPasswordLogin } from "../../password_login/impl"
import { initPasswordResetSession } from "../../password_reset_session/impl"
import { initPasswordReset } from "../../password_reset/impl"

import { initLoginIDField } from "../../field/login_id/impl"
import { initPasswordField } from "../../field/password/impl"

import { loginIDField } from "../../../common/field/login_id/impl/core"
import { passwordField } from "../../../common/field/password/impl/core"

import { currentPagePathname, detectViewState, detectResetToken } from "../impl/location"

import { LoginFactory } from "../view"

export function newLoginAsSingle(): LoginFactory {
    const credentialStorage = localStorage
    const currentURL = new URL(location.toString())

    const host = newHostConfig()
    const time = newTimeConfig()
    const authClient = initAuthClient(env.authServerURL)

    const authCredentials = initAuthCredentialRepository(credentialStorage)

    const factory: Factory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(host),
            storeCredential: initStoreCredentialAction(authCredentials),
            credential: initCredentialAction(authCredentials),
            renew: initRenewAction(time, authClient),

            passwordLogin: initPasswordLoginAction(time, authClient),
            passwordResetSession: initPasswordResetSessionAction(time),
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

    return () => initLoginAsSingle(factory, collector)
}
