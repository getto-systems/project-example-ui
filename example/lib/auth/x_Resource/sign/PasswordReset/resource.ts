import { ResetComponent } from "./Reset/component"
import { FormComponent } from "./Form/component"

import { FormAction } from "../../../../vendor/getto-form/form/action"
import { AuthLocationAction } from "../../../sign/authLocation/action"
import { LoginIDFormFieldAction } from "../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../common/field/password/action"
import {
    PasswordResetRegisterActionLocationInfo,
    PasswordResetRegisterActionPod,
} from "../../../sign/password/reset/register/action"
import { ContinuousRenewAuthCredentialAction } from "../../../sign/authCredential/continuousRenew/action"

export type PasswordResetResource = Readonly<{
    reset: ResetComponent
    form: FormComponent
}>

export type PasswordResetLocationInfo = PasswordResetRegisterActionLocationInfo
export type PasswordResetForegroundAction = Readonly<{
    continuousRenew: ContinuousRenewAuthCredentialAction
    location: AuthLocationAction

    form: Readonly<{
        core: FormAction
        loginID: LoginIDFormFieldAction
        password: PasswordFormFieldAction
    }>
}>
export type PasswordResetBackgroundActionPod = Readonly<{
    initRegister: PasswordResetRegisterActionPod
}>
