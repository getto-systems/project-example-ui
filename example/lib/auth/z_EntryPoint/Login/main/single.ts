import { initFormAction } from "../../../../sub/getto-form/main/form"

import { initLoginViewLocationInfo, View } from "../impl"

import { initLoginLocationInfo } from "../../../x_Resource/common/LocationInfo/impl"

import { initLoginLinkResource } from "../../../x_Resource/common/LoginLink/impl"
import { initRenewCredentialResource } from "../../../x_Resource/Login/RenewCredential/impl"
import { initPasswordLoginResource } from "../../../x_Resource/Login/PasswordLogin/impl"
import { initPasswordResetSessionResource } from "../../../x_Resource/Profile/PasswordResetSession/impl"
import { initPasswordResetResource } from "../../../x_Resource/Profile/PasswordReset/impl"

import { initRenewAction, initSetContinuousRenewAction } from "../../../login/credentialStore/main/renew"
import { initApplicationAction } from "../../../common/application/main/application"
import { initLoginIDFormFieldAction } from "../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../common/field/password/main/password"
import { initPasswordLoginAction } from "../../../login/passwordLogin/main/login"
import {
    initPasswordResetAction,
    initPasswordResetSessionAction,
} from "../../../profile/passwordReset/main/reset"

import { LoginEntryPoint, LoginForegroundAction } from "../entryPoint"

export function newLoginAsSingle(): LoginEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground: LoginForegroundAction = {
        application: initApplicationAction(),
        renew: initRenewAction(webStorage),
        setContinuousRenew: initSetContinuousRenewAction(webStorage),

        form: {
            core: initFormAction(),
            loginID: initLoginIDFormFieldAction(),
            password: initPasswordFormFieldAction(),
        },
    }

    const locationInfo = initLoginLocationInfo(currentURL)

    const view = new View(initLoginViewLocationInfo(currentURL), {
        loginLink: initLoginLinkResource,

        renewCredential: () => initRenewCredentialResource(locationInfo, foreground),

        passwordLogin: () =>
            initPasswordLoginResource(locationInfo, foreground, {
                login: initPasswordLoginAction(),
            }),
        passwordResetSession: () =>
            initPasswordResetSessionResource(foreground, {
                resetSession: initPasswordResetSessionAction(),
            }),
        passwordReset: () =>
            initPasswordResetResource(locationInfo, foreground, {
                reset: initPasswordResetAction(),
            }),
    })
    return {
        view,
        terminate: () => {
            view.terminate()
        },
    }
}
