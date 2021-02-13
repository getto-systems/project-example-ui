import { LoginComponent } from "./Login/component"
import { FormComponent } from "./Form/component"

import { FormAction } from "../../../../common/getto-form/form/action"
import { LocationActionPod, LocationActionLocationInfo } from "../../../sign/location/action"
import { LoginIDFormFieldAction } from "../../../../common/auth/field/loginID/action"
import { PasswordFormFieldAction } from "../../../../common/auth/field/password/action"
import { LoginAction } from "../../../sign/passwordLogin/action"
import { ContinuousRenewActionPod } from "../../../sign/authCredential/continuousRenew/action"

export type PasswordLoginResource = Readonly<{
    login: LoginComponent
    form: FormComponent
}>

export type PasswordLoginLocationInfo = LocationActionLocationInfo
export type PasswordLoginForegroundActionPod = Readonly<{
    initContinuousRenew: ContinuousRenewActionPod
    initLocation: LocationActionPod

    form: Readonly<{
        core: FormAction
        loginID: LoginIDFormFieldAction
        password: PasswordFormFieldAction
    }>
}>
export type PasswordLoginBackgroundAction = Readonly<{
    login: LoginAction
}>
