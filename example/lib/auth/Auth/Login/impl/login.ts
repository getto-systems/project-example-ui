import { PasswordLoginResource } from "../entryPoint"

import { LoginLinkFactory } from "../../link"

import {
    PasswordLoginComponentFactory,
    PasswordLoginFormComponentFactory,
    PasswordLoginFormMaterial,
    PasswordLoginMaterial,
} from "../../passwordLogin/component"

import { FormAction } from "../../../../sub/getto-form/action/action"
import { ApplicationAction, SecureScriptPathCollector } from "../../../common/application/action"
import { LoginIDFormFieldAction } from "../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../common/field/password/action"
import { PasswordLoginAction } from "../../../login/passwordLogin/action"
import { SetContinuousRenewAction } from "../../../login/renew/action"

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
export type PasswordLoginCollector = Readonly<{
    application: SecureScriptPathCollector
}>
export function initPasswordLoginResource(
    factory: PasswordLoginFactory,
    collector: PasswordLoginCollector
): PasswordLoginResource {
    const material: PasswordLoginMaterial = {
        link: factory.link(),
        login: factory.actions.passwordLogin.login(),
        setContinuousRenew: factory.actions.setContinuousRenew.setContinuousRenew(),
        secureScriptPath: factory.actions.application.secureScriptPath(collector.application),
    }

    return {
        passwordLogin: factory.components.passwordLogin.core(material),
        form: factory.components.passwordLogin.form(formMaterial()),
    }

    function formMaterial(): PasswordLoginFormMaterial {
        return {
            validation: factory.actions.form.core.validation(),
            history: factory.actions.form.core.history(),
            loginID: factory.actions.form.loginID.field(),
            password: factory.actions.form.password.field(),
            checker: factory.actions.form.password.character(),
            viewer: factory.actions.form.password.viewer(),
        }
    }
}
