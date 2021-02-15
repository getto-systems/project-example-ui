import { newLoginActionPod } from "../../../sign/password/login/main"
import { newRegisterActionPod } from "../../../sign/password/reset/register/main"
import { newContinuousRenewAction } from "../../../sign/authCredential/continuousRenew/main"
import { newRenewActionPod } from "../../../sign/authCredential/renew/main"
import { newSessionActionPod } from "../../../sign/password/reset/session/main"
import { newLocationAction } from "../../../sign/location/main"

import { initFormAction } from "../../../../vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../common/field/password/main/password"

import { initLoginViewLocationInfo, View } from "../impl"

import { initLoginLinkResource } from "../../../x_Resource/common/LoginLink/impl"
import { initRenewCredentialResource } from "../../../x_Resource/Sign/RenewCredential/impl"
import { initPasswordLoginResource } from "../../../x_Resource/Sign/PasswordLogin/impl"
import { initPasswordResetSessionResource } from "../../../x_Resource/Sign/PasswordResetSession/impl"
import { initPasswordResetResource } from "../../../x_Resource/Sign/PasswordReset/impl"
import { initRegisterActionLocationInfo } from "../../../sign/password/reset/register/impl"

import { LoginBackgroundActionPod, LoginEntryPoint, LoginForegroundAction } from "../entryPoint"

export function newLoginAsSingle(): LoginEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground: LoginForegroundAction = {
        renew: newRenewActionPod(webStorage),
        continuousRenew: newContinuousRenewAction(webStorage),
        location: newLocationAction(),

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

    const view = new View(initLoginViewLocationInfo(currentURL), {
        loginLink: initLoginLinkResource,

        renewCredential: () => initRenewCredentialResource(foreground),

        passwordLogin: () => initPasswordLoginResource(foreground, background),
        passwordResetSession: () => initPasswordResetSessionResource(foreground, background),
        passwordReset: () =>
            initPasswordResetResource(
                initRegisterActionLocationInfo(currentURL),
                foreground,
                background
            ),
    })
    return {
        view,
        terminate: () => {
            view.terminate()
        },
    }
}
