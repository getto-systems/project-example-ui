import { LoginLink } from "../link"

import { ApplicationComponent } from "../../../sub/getto-example/application/component"
import { FormState, FormMaterial } from "../../../sub/getto-form/component/component"
import { LoginIDFormFieldComponent } from "../field/loginID/component"
import { PasswordFormFieldComponent } from "../field/password/component"

import { Login } from "../../login/passwordLogin/action"
import { SetContinuousRenew } from "../../login/renew/action"
import { SecureScriptPath } from "../../common/application/action"
import { LoginIDFormField } from "../../common/field/loginID/action"
import {
    PasswordCharacterChecker,
    PasswordFormField,
    PasswordViewer,
} from "../../common/field/password/action"

import { FormConvertResult } from "../../../sub/getto-form/data"
import { ScriptPath, LoadError } from "../../common/application/data"
import { StorageError } from "../../common/credential/data"
import { LoginError, LoginFields } from "../../login/passwordLogin/data"

export interface PasswordLoginComponentFactory {
    (material: PasswordLoginMaterial): PasswordLoginComponent
}
export type PasswordLoginMaterial = Readonly<{
    link: LoginLink
    login: Login
    setContinuousRenew: SetContinuousRenew
    secureScriptPath: SecureScriptPath
}>

export interface PasswordLoginComponent extends ApplicationComponent<PasswordLoginState> {
    readonly link: LoginLink
    login(fields: FormConvertResult<LoginFields>): void
    loadError(err: LoadError): void
}

export type PasswordLoginState =
    | Readonly<{ type: "initial-login" }>
    | Readonly<{ type: "try-to-login" }>
    | Readonly<{ type: "delayed-to-login" }>
    | Readonly<{ type: "try-to-load"; scriptPath: ScriptPath }>
    | Readonly<{ type: "failed-to-login"; err: LoginError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialPasswordLoginState: PasswordLoginState = { type: "initial-login" }

export interface PasswordLoginFormComponentFactory {
    (material: PasswordLoginFormMaterial): PasswordLoginFormComponent
}
export type PasswordLoginFormMaterial = FormMaterial &
    Readonly<{
        loginID: LoginIDFormField
        password: PasswordFormField
        checker: PasswordCharacterChecker
        viewer: PasswordViewer
    }>

export interface PasswordLoginFormComponent extends ApplicationComponent<FormState> {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent
    getLoginFields(): FormConvertResult<LoginFields>
}
