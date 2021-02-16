import { newAuthSignRenewResource } from "../resources/Renew/main"

import { newPasswordLoginAction } from "../../../sign/password/authenticate/main/core"
import {
    newPasswordResetRegisterAction,
    newPasswordResetRegisterActionPod,
} from "../../../sign/password/resetSession/register/main/core"
import { newContinuousRenewAuthnInfoAction_legacy } from "../../../sign/authnInfo/startContinuousRenew/main"
import { newPasswordResetSessionActionPod } from "../../../sign/password/resetSession/start/main/core"
import { newAuthLocationAction_legacy } from "../../../sign/secureScriptPath/get/main"

import { initFormAction } from "../../../../common/vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../common/field/password/main/password"

import { initLoginViewLocationInfo, View } from "../impl"

import { initAuthSignLinkResource } from "../resources/Link/impl"
import { initAuthSignPasswordLoginResource } from "../resources/Password/Login/impl"
import { initPasswordResetSessionResource } from "../../../x_Resource/sign/PasswordResetSession/impl"
import { initPasswordResetResource } from "../resources/Password/Reset/Register/impl"

import { AuthSignEntryPoint } from "../entryPoint"

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
        initRegister: newPasswordResetRegisterActionPod(),
    }

    const view = new View(initLoginViewLocationInfo(currentURL), {
        link: initAuthSignLinkResource,

        renew: () => newAuthSignRenewResource(webStorage),

        passwordLogin: () =>
            initAuthSignPasswordLoginResource({
                login: {
                    continuousRenew: newContinuousRenewAuthnInfoAction_legacy(webStorage),
                    location: newAuthLocationAction_legacy(),
                    login: newPasswordLoginAction(),
                },

                form: formMaterial(),
            }),
        passwordResetSession: () =>
            initPasswordResetSessionResource(foreground, background),
        passwordReset: () =>
            initPasswordResetResource({
                register: {
                    continuousRenew: newContinuousRenewAuthnInfoAction_legacy(webStorage),
                    location: newAuthLocationAction_legacy(),
                    register: newPasswordResetRegisterAction(),
                },

                form: formMaterial(),
            }),
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
