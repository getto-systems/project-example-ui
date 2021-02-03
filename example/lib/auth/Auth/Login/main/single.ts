import { initAuthClient } from "../../../../z_external/api/authClient"

import { env } from "../../../../y_environment/env"

import {
    initApplicationAction,
    initAuthCredentialStorage,
    initRenewAction,
    initSetContinuousRenewAction,
} from "./worker/foreground"
import {
    initPasswordLoginAction,
    initPasswordResetAction,
    initPasswordResetSessionAction,
} from "./worker/background"

import {
    LoginViewCollector,
    View,
    RenewCredentialFactory,
    RenewCredentialCollector,
    PasswordLoginFactory,
    PasswordLoginCollector,
    PasswordResetSessionFactory,
    PasswordResetFactory,
    PasswordResetCollector,
    initRenewCredentialResource,
    initPasswordLoginResource,
    initPasswordResetSessionResource,
    initPasswordResetResource,
} from "../impl/core"

import {
    newApplicationActionConfig,
    newPasswordLoginActionConfig,
    newPasswordResetActionConfig,
    newPasswordResetSessionActionConfig,
    newRenewActionConfig,
    newSetContinuousRenewActionConfig,
} from "./config"
import { initLoginLink } from "./link"

import { initAuthCredentialRepository } from "../../../login/renew/impl/repository/authCredential"

import { initRenewCredentialComponent } from "../../renewCredential/impl"
import { initPasswordLoginComponent } from "../../passwordLogin/impl"
import { initPasswordResetSessionComponent } from "../../passwordResetSession/impl"
import { initPasswordResetComponent } from "../../passwordReset/impl"

import { initLoginIDFieldComponent } from "../../field/loginID/impl"
import { initPasswordFieldComponent } from "../../field/password/impl"

import { loginIDField } from "../../../common/field/loginID/impl/core"
import { passwordField } from "../../../common/field/password/impl/core"

import { currentPagePathname, detectViewState, detectResetToken } from "../impl/location"

import { LoginEntryPoint } from "../entryPoint"

export function newLoginAsSingle(): LoginEntryPoint {
    const credentialStorage = localStorage
    const currentURL = new URL(location.toString())

    const authClient = initAuthClient(env.authServerURL)
    const authCredentials = initAuthCredentialRepository(initAuthCredentialStorage(credentialStorage))

    const factory: Factory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(newApplicationActionConfig()),
            renew: initRenewAction(newRenewActionConfig(), authCredentials, authClient),
            setContinuousRenew: initSetContinuousRenewAction(
                newSetContinuousRenewActionConfig(),
                authCredentials,
                authClient
            ),

            passwordLogin: initPasswordLoginAction(newPasswordLoginActionConfig(), authClient),
            passwordResetSession: initPasswordResetSessionAction(newPasswordResetSessionActionConfig()),
            passwordReset: initPasswordResetAction(newPasswordResetActionConfig()),

            field: {
                loginID: loginIDField,
                password: passwordField,
            },
        },
        components: {
            renewCredential: initRenewCredentialComponent,

            passwordLogin: initPasswordLoginComponent,
            passwordResetSession: initPasswordResetSessionComponent,
            passwordReset: initPasswordResetComponent,

            field: {
                loginID: initLoginIDFieldComponent,
                password: initPasswordFieldComponent,
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

    const view = new View(collector, {
        renewCredential: (setup) => initRenewCredentialResource(factory, collector, setup),

        passwordLogin: () => initPasswordLoginResource(factory, collector),
        passwordResetSession: () => initPasswordResetSessionResource(factory),
        passwordReset: () => initPasswordResetResource(factory, collector),
    })
    return {
        view,
        terminate: () => {
            view.terminate()
        },
    }
}

type Factory = RenewCredentialFactory &
    PasswordLoginFactory &
    PasswordResetSessionFactory &
    PasswordResetFactory

type Collector = LoginViewCollector &
    RenewCredentialCollector &
    PasswordLoginCollector &
    PasswordResetCollector
