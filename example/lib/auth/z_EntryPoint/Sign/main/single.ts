import { newPasswordLoginActionPod } from "../../../sign/password/login/main/core"
import { newPasswordResetRegisterRegisterActionPod } from "../../../sign/password/reset/register/main"
import { newContinuousRenewAuthCredentialAction } from "../../../sign/authCredential/continuousRenew/main"
import { newRenewAuthCredentialActionPod } from "../../../sign/authCredential/renew/main"
import { newPasswordResetSessionActionPod } from "../../../sign/password/reset/session/main/core"
import { newAuthLocationAction } from "../../../sign/authLocation/main"

import { initFormAction } from "../../../../vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../common/field/password/main/password"

import { initLoginViewLocationInfo, View } from "../impl"

import { initLoginLinkResource } from "../../../x_Resource/common/LoginLink/impl"
import { initRenewCredentialResource } from "../../../x_Resource/sign/RenewCredential/impl"
import { initPasswordLoginResource } from "../../../x_Resource/sign/PasswordLogin/impl"
import { initPasswordResetSessionResource } from "../../../x_Resource/sign/PasswordResetSession/impl"
import { initPasswordResetResource } from "../../../x_Resource/sign/PasswordReset/impl"
import { initPasswordResetRegisterActionLocationInfo } from "../../../sign/password/reset/register/impl"

import { LoginBackgroundActionPod, LoginEntryPoint, LoginForegroundAction } from "../entryPoint"

export function newLoginAsSingle(): LoginEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground: LoginForegroundAction = {
        renew: newRenewAuthCredentialActionPod(webStorage),
        continuousRenew: newContinuousRenewAuthCredentialAction(webStorage),
        location: newAuthLocationAction(),

        form: {
            core: initFormAction(),
            loginID: initLoginIDFormFieldAction(),
            password: initPasswordFormFieldAction(),
        },
    }
    const background: LoginBackgroundActionPod = {
        initLogin: newPasswordLoginActionPod(),
        initSession: newPasswordResetSessionActionPod(),
        initRegister: newPasswordResetRegisterRegisterActionPod(),
    }

    const view = new View(initLoginViewLocationInfo(currentURL), {
        loginLink: initLoginLinkResource,

        renewCredential: () => initRenewCredentialResource(foreground),

        passwordLogin: () => initPasswordLoginResource(foreground, background),
        passwordResetSession: () => initPasswordResetSessionResource(foreground, background),
        passwordReset: () =>
            initPasswordResetResource(
                initPasswordResetRegisterActionLocationInfo(currentURL),
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
