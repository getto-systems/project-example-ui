import { initFormAction } from "../../../../../sub/getto-form/main/form"

import { View } from "../impl/core"

import { initLoginLink } from "./link"

import { initLoginViewLocationInfo } from "../impl/location"
import { initLoginLocationInfo } from "../../common/impl/location"

import { initRenewCredentialResource } from "../../renewCredential/impl/resource"
import { initPasswordLoginResource } from "../../passwordLogin/impl/resource"
import { initPasswordResetSessionResource } from "../../passwordResetSession/impl/resource"
import { initPasswordResetResource } from "../../passwordReset/impl/resource"

import {
    initRenewAction,
    initSetContinuousRenewAction,
} from "../../../../login/credentialStore/main/renew"
import { initApplicationAction } from "../../../../common/application/main/application"
import { initLoginIDFormFieldAction } from "../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../common/field/password/main/password"
import { initPasswordLoginAction } from "../../../../login/passwordLogin/main/login"
import {
    initPasswordResetAction,
    initPasswordResetSessionAction,
} from "../../../../profile/passwordReset/main/reset"

import { LoginEntryPoint, LoginForegroundAction } from "../entryPoint"

export function newLoginAsSingle(): LoginEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const foreground: LoginForegroundAction = {
        link: initLoginLink,
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
        renewCredential: (setup) => initRenewCredentialResource(setup, locationInfo, foreground),

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
