import { newLoginActionPod } from "../../../sign/password/login/main"
import { newRegisterActionPod } from "../../../sign/password/reset/register/main"
import { newContinuousRenewActionPod } from "../../../sign/authCredential/continuousRenew/main"
import { newRenewActionPod } from "../../../sign/authCredential/renew/main"
import { newSessionActionPod } from "../../../sign/password/reset/session/main"
import { newLocationActionPod } from "../../../sign/location/main"

import { initFormAction } from "../../../../vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../common/field/password/main/password"

import { initLoginViewLocationInfo, View } from "../impl"
import { initLoginLocationInfo } from "../../../x_Resource/common/LocationInfo/impl"

import { initLoginLinkResource } from "../../../x_Resource/common/LoginLink/impl"
import { initRenewCredentialResource } from "../../../x_Resource/Sign/RenewCredential/impl"
import { initPasswordLoginResource } from "../../../x_Resource/Sign/PasswordLogin/impl"
import { initPasswordResetSessionResource } from "../../../x_Resource/Sign/PasswordResetSession/impl"
import { initPasswordResetResource } from "../../../x_Resource/Sign/PasswordReset/impl"

import { LoginBackgroundActionPod, LoginEntryPoint, LoginForegroundActionPod } from "../entryPoint"

export function newLoginAsSingle(): LoginEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground: LoginForegroundActionPod = {
        initRenew: newRenewActionPod(webStorage),
        initContinuousRenew: newContinuousRenewActionPod(webStorage),
        initLocation: newLocationActionPod(),

        form: {
            core: initFormAction(),
            loginID: initLoginIDFormFieldAction(),
            password: initPasswordFormFieldAction(),
        },
    }
    const background: LoginBackgroundActionPod = {
        initLogin: newLoginActionPod(),
        initSession: newSessionActionPod(),
        initRegister: newRegisterActionPod(),
    }

    const locationInfo = initLoginLocationInfo(currentURL)

    const view = new View(initLoginViewLocationInfo(currentURL), {
        loginLink: initLoginLinkResource,

        renewCredential: () => initRenewCredentialResource(locationInfo, foreground),

        passwordLogin: () => initPasswordLoginResource(locationInfo, foreground, background),
        passwordResetSession: () => initPasswordResetSessionResource(foreground, background),
        passwordReset: () => initPasswordResetResource(locationInfo, foreground, background),
    })
    return {
        view,
        terminate: () => {
            view.terminate()
        },
    }
}
