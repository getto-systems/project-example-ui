import {
    newGetSecureScriptPathInfra,
    newGetSecureScriptPathLocationInfo,
} from "../../../../../common/secureScriptPath/get/main"
import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../kernel/authnInfo/common/startContinuousRenew/main"
import { newAuthenticatePasswordInfra } from "../../../main"

import { initFormAction } from "../../../../../../../common/vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../../../common/field/password/main/password"
import { initAuthenticatePasswordFormAction } from "../Form/impl"

import {
    AuthenticatePasswordCoreBackgroundBase,
    AuthenticatePasswordCoreForegroundBase,
    initAuthenticatePasswordCoreAction,
    initAuthenticatePasswordCoreAction_merge,
    initAuthenticatePasswordCoreBackground,
} from "../Core/impl"

import { AuthenticatePasswordResource } from "../action"
import { AuthenticatePasswordCoreAction, AuthenticatePasswordCoreBackground } from "../Core/action"
import { AuthenticatePasswordFormAction } from "../Form/action"

export function newPasswordAuthenticate(webStorage: Storage): AuthenticatePasswordResource {
    return mergeResource(newCoreAction(webStorage))
}
export function newPasswordAuthenticate_proxy(
    webStorage: Storage,
    background: AuthenticatePasswordCoreBackground
): AuthenticatePasswordResource {
    return mergeResource(
        initAuthenticatePasswordCoreAction_merge(
            newForegroundBase(webStorage),
            newGetSecureScriptPathLocationInfo(),
            background
        )
    )
}
function mergeResource(core: AuthenticatePasswordCoreAction): AuthenticatePasswordResource {
    return { core, form: newFormAction() }
}

export function newAuthenticatePasswordCoreBackground(): AuthenticatePasswordCoreBackground {
    return initAuthenticatePasswordCoreBackground(newBackgroundBase())
}

function newCoreAction(webStorage: Storage): AuthenticatePasswordCoreAction {
    return initAuthenticatePasswordCoreAction(
        { ...newForegroundBase(webStorage), ...newBackgroundBase() },
        newGetSecureScriptPathLocationInfo()
    )
}

function newForegroundBase(webStorage: Storage): AuthenticatePasswordCoreForegroundBase {
    return {
        startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
        getSecureScriptPath: newGetSecureScriptPathInfra(),
    }
}
function newBackgroundBase(): AuthenticatePasswordCoreBackgroundBase {
    return {
        authenticate: newAuthenticatePasswordInfra(),
    }
}

function newFormAction(): AuthenticatePasswordFormAction {
    const form = initFormAction()
    const loginID = initLoginIDFormFieldAction()
    const password = initPasswordFormFieldAction()
    return initAuthenticatePasswordFormAction({
        validation: form.validation(),
        history: form.history(),
        loginID: loginID.field(),
        password: password.field(),
        character: password.character(),
        viewer: password.viewer(),
    })
}
