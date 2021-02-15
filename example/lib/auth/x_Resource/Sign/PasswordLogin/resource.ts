import { LoginComponent } from "./Login/component"
import { FormComponent } from "./Form/component"

import { FormAction } from "../../../../vendor/getto-form/form/action"
import { LocationAction } from "../../../sign/location/action"
import { LoginIDFormFieldAction } from "../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../common/field/password/action"
import { LoginActionPod } from "../../../sign/password/login/action"
import { ContinuousRenewAction } from "../../../sign/authCredential/continuousRenew/action"

export type PasswordLoginResource = Readonly<{
    login: LoginComponent
    form: FormComponent
}>

export type PasswordLoginForegroundAction = Readonly<{
    continuousRenew: ContinuousRenewAction
    location: LocationAction

    form: Readonly<{
        core: FormAction
        loginID: LoginIDFormFieldAction
        password: PasswordFormFieldAction
    }>
}>
export type PasswordLoginBackgroundActionPod = Readonly<{
    initLogin: LoginActionPod
}>
