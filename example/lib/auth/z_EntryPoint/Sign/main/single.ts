import { newRenewAuthInfoResource } from "../../../x_Resource/Sign/AuthInfo/Renew/main"

import { newPasswordResetSessionActionPod } from "../../../sign/password/resetSession/start/main/core"

import { initFormAction } from "../../../../common/vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../common/field/password/main/password"

import { initLoginViewLocationInfo, View } from "../impl"

import { initAuthSignLinkResource } from "../../../x_Resource/Sign/Link/impl"
import { initPasswordResetSessionResource } from "../../../x_Resource/Sign/PasswordResetSession/impl"

import { AuthSignEntryPoint } from "../entryPoint"
import { newPasswordAuthenticateResource } from "../../../x_Resource/Sign/Password/Authenticate/main/core"
import { newRegisterPasswordResource } from "../../../x_Resource/Sign/Password/ResetSession/Register/main/core"

export function newLoginAsSingle(): AuthSignEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground = {
        form: {
            core: initFormAction(),
            loginID: initLoginIDFormFieldAction(),
            password: initPasswordFormFieldAction(),
        },
    }
    const background = {
        initSession: newPasswordResetSessionActionPod(),
    }

    const view = new View(initLoginViewLocationInfo(currentURL), {
        link: initAuthSignLinkResource,

        renew: () => newRenewAuthInfoResource(webStorage),

        passwordLogin: () => newPasswordAuthenticateResource(webStorage),
        passwordResetSession: () =>
            initPasswordResetSessionResource(foreground, background),
        passwordReset: () => newRegisterPasswordResource(webStorage),
    })
    return {
        view,
        terminate: () => {
            view.terminate()
        },
    }
}
