import { initAuthClient } from "../../../../z_external/auth_client/auth_client"

import { env } from "../../../../y_static/env"

import {
    initApplicationAction,
    initAuthCredentialRepository,
    initCredentialAction,
    initRenewAction,
    initStoreCredentialAction,
} from "./worker/foreground"
import {
    initPasswordLoginAction,
    initPasswordResetAction,
    initPasswordResetSessionAction,
} from "./worker/background"

import {
    newApplicationActionConfig,
    newPasswordLoginActionConfig,
    newPasswordResetActionConfig,
    newPasswordResetSessionActionConfig,
    newRenewActionConfig,
} from "../impl/config"
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

    const authClient = initAuthClient(env.authServerURL)
    const authCredentials = initAuthCredentialRepository(credentialStorage)

    const factory: Factory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(newApplicationActionConfig()),
            storeCredential: initStoreCredentialAction(authCredentials),
            credential: initCredentialAction(authCredentials),
            renew: initRenewAction(newRenewActionConfig(), authClient),

            passwordLogin: initPasswordLoginAction(newPasswordLoginActionConfig(), authClient),
            passwordResetSession: initPasswordResetSessionAction(newPasswordResetSessionActionConfig()),
            passwordReset: initPasswordResetAction(newPasswordResetActionConfig()),

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
