import { ResetComponent } from "./Reset/component"
import { FormComponent } from "./Form/component"

import { FormAction } from "../../../../vendor/getto-form/form/action"
import { LocationActionPod, LocationActionLocationInfo } from "../../../sign/location/action"
import { LoginIDFormFieldAction } from "../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../common/field/password/action"
import {
    RegisterActionLocationInfo,
    RegisterActionPod,
} from "../../../sign/password/reset/register/action"
import { ContinuousRenewAction } from "../../../sign/authCredential/continuousRenew/action"

export type PasswordResetResource = Readonly<{
    reset: ResetComponent
    form: FormComponent
}>

export type PasswordResetLocationInfo = LocationActionLocationInfo & RegisterActionLocationInfo
export type PasswordResetForegroundAction = Readonly<{
    continuousRenew: ContinuousRenewAction
    initLocation: LocationActionPod

    form: Readonly<{
        core: FormAction
        loginID: LoginIDFormFieldAction
        password: PasswordFormFieldAction
    }>
}>
export type PasswordResetBackgroundActionPod = Readonly<{
    initRegister: RegisterActionPod
}>
