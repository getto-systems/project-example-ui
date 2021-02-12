import { LoginComponent } from "./Login/component"
import { FormComponent } from "./Form/component"

import { FormAction } from "../../../../sub/getto-form/form/action"
import { ApplicationAction, SecureScriptPathLocationInfo } from "../../../common/application/action"
import { LoginIDFormFieldAction } from "../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../common/field/password/action"
import { SetContinuousRenewAction } from "../../../login/credentialStore/action"
import { LoginAction } from "../../../login/passwordLogin/action"

export type PasswordLoginResource = Readonly<{
    login: LoginComponent
    form: FormComponent
}>

export type PasswordLoginLocationInfo = Readonly<{
    application: SecureScriptPathLocationInfo
}>
export type PasswordLoginForegroundAction = Readonly<{
    application: ApplicationAction
    setContinuousRenew: SetContinuousRenewAction
    form: Readonly<{
        core: FormAction
        loginID: LoginIDFormFieldAction
        password: PasswordFormFieldAction
    }>
}>
export type PasswordLoginBackgroundAction = Readonly<{
    login: LoginAction
}>
