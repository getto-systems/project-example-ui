import { LoginComponent } from "./Login/component"
import { FormComponent } from "./Form/component"

import { FormAction } from "../../../../common/getto-form/form/action"
import { ApplicationAction, SecureScriptPathLocationInfo } from "../../../sign/location/action"
import { LoginIDFormFieldAction } from "../../../../common/auth/field/loginID/action"
import { PasswordFormFieldAction } from "../../../../common/auth/field/password/action"
import { SetContinuousRenewAction } from "../../../sign/authCredential/renew/action"
import { LoginAction } from "../../../sign/passwordLogin/action"

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
