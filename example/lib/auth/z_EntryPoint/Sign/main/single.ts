import { newRenewActionPod } from "../../../sign/authCredential/renew/main"
import { newContinuousRenewActionPod } from "../../../sign/authCredential/continuousRenew/main"

import { initFormAction } from "../../../../common/getto-form/main/form"

import { initLoginViewLocationInfo, View } from "../impl"

import { initLoginLocationInfo } from "../../../x_Resource/common/LocationInfo/impl"

import { initLoginLinkResource } from "../../../x_Resource/common/LoginLink/impl"
import { initRenewCredentialResource } from "../../../x_Resource/Sign/RenewCredential/impl"
import { initPasswordLoginResource } from "../../../x_Resource/Sign/PasswordLogin/impl"
import { initPasswordResetSessionResource } from "../../../x_Resource/Sign/PasswordResetSession/impl"
import { initPasswordResetResource } from "../../../x_Resource/Sign/PasswordReset/impl"

import { initApplicationAction } from "../../../sign/location/main/application"
import { initLoginIDFormFieldAction } from "../../../../common/auth/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../common/auth/field/password/main/password"
import { initPasswordLoginAction } from "../../../sign/passwordLogin/main/login"
import {
    initPasswordResetAction,
    initPasswordResetSessionAction,
} from "../../../sign/passwordReset/main/reset"

import { LoginEntryPoint, LoginForegroundAction } from "../entryPoint"

export function newLoginAsSingle(): LoginEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground: LoginForegroundAction = {
        initRenew: newRenewActionPod(webStorage),
        initContinuousRenew: newContinuousRenewActionPod(webStorage),

        application: initApplicationAction(),

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
