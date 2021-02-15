import { LoginComponent } from "./Login/component"
import { FormComponent } from "./Form/component"

import { FormAction } from "../../../../vendor/getto-form/form/action"
import { AuthLocationAction } from "../../../sign/authLocation/action"
import { LoginIDFormFieldAction } from "../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../common/field/password/action"
import { PasswordLoginActionPod } from "../../../sign/password/login/action"
import { ContinuousRenewAuthCredentialAction } from "../../../sign/authCredential/continuousRenew/action"

export type PasswordLoginResource = Readonly<{
    login: LoginComponent
    form: FormComponent
}>

export type PasswordLoginForegroundAction = Readonly<{
    continuousRenew: ContinuousRenewAuthCredentialAction
    location: AuthLocationAction

    form: Readonly<{
        core: FormAction
        loginID: LoginIDFormFieldAction
        password: PasswordFormFieldAction
    }>
}>
export type PasswordLoginBackgroundActionPod = Readonly<{
    initLogin: PasswordLoginActionPod
}>
