import { newPasswordLoginActionPod } from "../../../sign/password/login/main/core"
import { newPasswordResetRegisterActionPod } from "../../../sign/password/reset/register/main/core"
import { newContinuousRenewAuthCredentialAction } from "../../../sign/authCredential/continuousRenew/main"
import { newRenewAuthCredentialAction } from "../../../sign/authCredential/renew/main"
import { newPasswordResetSessionActionPod } from "../../../sign/password/reset/session/main/core"
import { newAuthLocationAction } from "../../../sign/authLocation/main"

import { initFormAction } from "../../../../vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../common/field/password/main/password"

import { initLoginViewLocationInfo, View } from "../impl"

import { initAuthSignLinkResource } from "../resources/Link/impl"
import { initAuthSignRenewResource } from "../resources/Renew/impl"
import { initAuthSignPasswordLoginResource } from "../resources/Password/Login/impl"
import { initPasswordResetSessionResource } from "../../../x_Resource/sign/PasswordResetSession/impl"
import { initPasswordResetResource } from "../../../x_Resource/sign/PasswordReset/impl"
import { initPasswordResetRegisterActionLocationInfo } from "../../../sign/password/reset/register/impl"

import { AuthSignEntryPoint } from "../entryPoint"
import { initPasswordLoginAction } from "../../../sign/password/login/impl"

export function newLoginAsSingle(): AuthSignEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground = {
        renew: newRenewAuthCredentialAction(webStorage),
        continuousRenew: newContinuousRenewAuthCredentialAction(webStorage),
        location: newAuthLocationAction(),

        form: {
            core: initFormAction(),
            loginID: initLoginIDFormFieldAction(),
            password: initPasswordFormFieldAction(),
        },
    }
    const background = {
        initSession: newPasswordResetSessionActionPod(),
        initRegister: newPasswordResetRegisterActionPod(),
    }

    const material = {
        login: {
            continuousRenew: newContinuousRenewAuthCredentialAction(webStorage),
            location: newAuthLocationAction(),
            login: initPasswordLoginAction(newPasswordLoginActionPod()),
        },

        form: formMaterial(),
    }

    const view = new View(initLoginViewLocationInfo(currentURL), {
        link: initAuthSignLinkResource,

        renewCredential: () => initAuthSignRenewResource(foreground),

        passwordLogin: () => initAuthSignPasswordLoginResource(material),
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

function formMaterial() {
    const form = initFormAction()
    const loginID = initLoginIDFormFieldAction()
    const password = initPasswordFormFieldAction()
    return {
        validation: form.validation(),
        history: form.history(),
        loginID: loginID.field(),
        password: password.field(),
        character: password.character(),
        viewer: password.viewer(),
    }
}
