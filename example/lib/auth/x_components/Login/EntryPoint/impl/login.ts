import { PasswordLoginResource } from "../entryPoint"

import { LoginLinkFactory } from "../../link"

import {
    PasswordLoginComponentFactory,
    PasswordLoginFormComponentFactory,
    PasswordLoginFormMaterial,
    PasswordLoginMaterial,
} from "../../passwordLogin/component"

import { FormAction } from "../../../../../sub/getto-form/form/action"
import { ApplicationAction, SecureScriptPathLocationInfo } from "../../../../common/application/action"
import { LoginIDFormFieldAction } from "../../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../../common/field/password/action"
import { PasswordLoginAction } from "../../../../login/passwordLogin/action"
import { SetContinuousRenewAction } from "../../../../login/renew/action"

export type PasswordLoginFactory = Readonly<{
    link: LoginLinkFactory
    actions: Readonly<{
        application: ApplicationAction
        setContinuousRenew: SetContinuousRenewAction
        passwordLogin: PasswordLoginAction
        form: Readonly<{
            core: FormAction
            loginID: LoginIDFormFieldAction
            password: PasswordFormFieldAction
        }>
    }>
    components: Readonly<{
        passwordLogin: Readonly<{
            core: PasswordLoginComponentFactory
            form: PasswordLoginFormComponentFactory
        }>
    }>
}>
export type PasswordLoginLocationInfo = Readonly<{
    application: SecureScriptPathLocationInfo
}>
export function initPasswordLoginResource(
    factory: PasswordLoginFactory,
    locationInfo: PasswordLoginLocationInfo
): PasswordLoginResource {
    return {
        passwordLogin: factory.components.passwordLogin.core(core()),
        form: factory.components.passwordLogin.form(form()),
    }

    function core(): PasswordLoginMaterial {
        return {
            link: factory.link(),
            login: factory.actions.passwordLogin.login(),
            setContinuousRenew: factory.actions.setContinuousRenew.setContinuousRenew(),
            secureScriptPath: factory.actions.application.secureScriptPath(locationInfo.application),
        }
    }
    function form(): PasswordLoginFormMaterial {
        return {
            validation: factory.actions.form.core.validation(),
            history: factory.actions.form.core.history(),
            loginID: factory.actions.form.loginID.field(),
            password: factory.actions.form.password.field(),
            character: factory.actions.form.password.character(),
            viewer: factory.actions.form.password.viewer(),
        }
    }
}
