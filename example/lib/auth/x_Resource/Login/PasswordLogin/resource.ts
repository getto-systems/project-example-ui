import { LoginLinkFactory } from "../../common/link"

import { PasswordLoginComponent } from "./Login/component"
import { PasswordLoginFormComponent } from "./Form/component"

import { FormAction } from "../../../../sub/getto-form/form/action"
import { ApplicationAction, SecureScriptPathLocationInfo } from "../../../common/application/action"
import { LoginIDFormFieldAction } from "../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../common/field/password/action"
import { SetContinuousRenewAction } from "../../../login/credentialStore/action"
import { LoginAction } from "../../../login/passwordLogin/action"

export type PasswordLoginResource = Readonly<{
    login: PasswordLoginComponent
    form: PasswordLoginFormComponent
}>

export type PasswordLoginLocationInfo = Readonly<{
    application: SecureScriptPathLocationInfo
}>
export type PasswordLoginForegroundAction = Readonly<{
    link: LoginLinkFactory
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
