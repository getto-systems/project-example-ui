import { newAuthSignRenewResource } from "../resources/Renew/main"

import { newContinuousRenewAuthnInfoAction_legacy } from "../../../sign/authnInfo/startContinuousRenew/main"
import { newPasswordResetSessionActionPod } from "../../../sign/password/resetSession/start/main/core"
import { newAuthLocationAction_legacy } from "../../../sign/secureScriptPath/get/main"

import { initFormAction } from "../../../../common/vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../common/field/password/main/password"

import { initLoginViewLocationInfo, View } from "../impl"

import { initAuthSignLinkResource } from "../resources/Link/impl"
import { initPasswordResetSessionResource } from "../../../x_Resource/sign/PasswordResetSession/impl"

import { AuthSignEntryPoint } from "../entryPoint"
import { newAuthSignPasswordAuthenticateResource } from "../resources/Password/Authenticate/main/core"
import { newAuthSignPasswordResetSessionRegisterResource } from "../resources/Password/ResetSession/Register/main/core"

export function newLoginAsSingle(): AuthSignEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground = {
        continuousRenew: newContinuousRenewAuthnInfoAction_legacy(webStorage),
        location: newAuthLocationAction_legacy(),

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

        renew: () => newAuthSignRenewResource(webStorage),

        passwordLogin: () => newAuthSignPasswordAuthenticateResource(webStorage),
        passwordResetSession: () =>
            initPasswordResetSessionResource(foreground, background),
        passwordReset: () => newAuthSignPasswordResetSessionRegisterResource(webStorage),
    })
    return {
        view,
        terminate: () => {
            view.terminate()
        },
    }
}
