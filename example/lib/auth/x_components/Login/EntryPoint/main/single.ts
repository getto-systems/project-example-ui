import { initApiAuthRenew } from "../../../../../z_external/api/auth/renew"
import { initApiAuthLogin } from "../../../../../z_external/api/auth/login"

import { env } from "../../../../../y_environment/env"

import { initFormAction } from "../../../../../sub/getto-form/main/form"
import { initAuthCredentialStorage, initRenewAction, initSetContinuousRenewAction } from "./action/renew"
import { initApplicationAction } from "./action/application"
import { initLoginIDFormFieldAction, initPasswordFormFieldAction } from "./action/form"
import { initPasswordLoginAction } from "./action/login"
import { initPasswordResetAction, initPasswordResetSessionAction } from "./action/reset"

import { LoginViewLocationInfo, View } from "../impl/core"
import {
    initRenewCredentialResource,
    RenewCredentialLocationInfo,
    RenewCredentialFactory,
} from "../impl/renew"
import {
    initPasswordLoginResource,
    PasswordLoginLocationInfo,
    PasswordLoginFactory,
} from "../impl/login"
import {
    initPasswordResetResource,
    initPasswordResetSessionResource,
    PasswordResetLocationInfo,
    PasswordResetFactory,
    PasswordResetSessionFactory,
} from "../impl/reset"

import {
    newApplicationActionConfig,
    newPasswordLoginActionConfig,
    newPasswordResetActionConfig,
    newPasswordResetSessionActionConfig,
    newRenewActionConfig,
    newSetContinuousRenewActionConfig,
} from "./config"
import { initLoginLink } from "./link"

import { initAuthCredentialRepository } from "../../../../login/renew/impl/repository/authCredential"

import { initRenewCredentialComponent } from "../../renewCredential/impl"
import { initPasswordLoginComponent, initPasswordLoginFormComponent } from "../../passwordLogin/impl"
import {
    initPasswordResetSessionComponent,
    initPasswordResetSessionFormComponent,
} from "../../passwordResetSession/impl"
import { initPasswordResetComponent, initPasswordResetFormComponent } from "../../passwordReset/impl"

import { currentPagePathname, detectViewState, detectResetToken } from "../impl/location"

import { LoginEntryPoint } from "../entryPoint"

export function newLoginAsSingle(): LoginEntryPoint {
    const credentialStorage = localStorage
    const currentURL = new URL(location.toString())

    const api = {
        auth: {
            renew: initApiAuthRenew(env.apiServerURL),
            login: initApiAuthLogin(env.apiServerURL),
        },
    }

    const authCredentials = initAuthCredentialRepository(
        initAuthCredentialStorage(env.storageKey, credentialStorage)
    )

    const factory: Factory = {
        link: initLoginLink,
        actions: {
            application: initApplicationAction(newApplicationActionConfig()),
            renew: initRenewAction(newRenewActionConfig(), authCredentials, api.auth.renew),
            setContinuousRenew: initSetContinuousRenewAction(
                newSetContinuousRenewActionConfig(),
                authCredentials,
                api.auth.renew
            ),

            passwordLogin: initPasswordLoginAction(newPasswordLoginActionConfig(), api.auth.login),
            passwordResetSession: initPasswordResetSessionAction(newPasswordResetSessionActionConfig()),
            passwordReset: initPasswordResetAction(newPasswordResetActionConfig()),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
                password: initPasswordFormFieldAction(),
            },
        },
        components: {
            renewCredential: initRenewCredentialComponent,

            passwordLogin: { core: initPasswordLoginComponent, form: initPasswordLoginFormComponent },
            passwordResetSession: {
                core: initPasswordResetSessionComponent,
                form: initPasswordResetSessionFormComponent,
            },
            passwordReset: { core: initPasswordResetComponent, form: initPasswordResetFormComponent },
        },
    }
    const locationInfo: LocationInfo = {
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

    const view = new View(locationInfo, {
        renewCredential: (setup) => initRenewCredentialResource(factory, locationInfo, setup),

        passwordLogin: () => initPasswordLoginResource(factory, locationInfo),
        passwordResetSession: () => initPasswordResetSessionResource(factory),
        passwordReset: () => initPasswordResetResource(factory, locationInfo),
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

type LocationInfo = LoginViewLocationInfo &
    RenewCredentialLocationInfo &
    PasswordLoginLocationInfo &
    PasswordResetLocationInfo
