import { ResetComponent } from "./Reset/component"
import { FormComponent } from "./Form/component"

import { FormAction } from "../../../../common/getto-form/form/action"
import { ApplicationAction, SecureScriptPathLocationInfo } from "../../../common/application/action"
import { LoginIDFormFieldAction } from "../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../common/field/password/action"
import { SetContinuousRenewAction } from "../../../login/credentialStore/action"
import { ResetAction, ResetLocationInfo } from "../../../profile/passwordReset/action"

export type PasswordResetResource = Readonly<{
    reset: ResetComponent
    form: FormComponent
}>

export type PasswordResetLocationInfo = Readonly<{
    application: SecureScriptPathLocationInfo
    reset: ResetLocationInfo
}>
export type PasswordResetForegroundAction = Readonly<{
    application: ApplicationAction
    setContinuousRenew: SetContinuousRenewAction
    form: Readonly<{
        core: FormAction
        loginID: LoginIDFormFieldAction
        password: PasswordFormFieldAction
    }>
}>
export type PasswordResetBackgroundAction = Readonly<{
    reset: ResetAction
}>
