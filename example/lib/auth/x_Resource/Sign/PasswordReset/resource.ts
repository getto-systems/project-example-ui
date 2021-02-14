import { ResetComponent } from "./Reset/component"
import { FormComponent } from "./Form/component"

import { FormAction } from "../../../../common/getto-form/form/action"
import { LocationActionPod, LocationActionLocationInfo } from "../../../sign/location/action"
import { LoginIDFormFieldAction } from "../../../../common/auth/field/loginID/action"
import { PasswordFormFieldAction } from "../../../../common/auth/field/password/action"
import {
    RegisterActionLocationInfo,
    RegisterActionPod,
} from "../../../sign/password/reset/register/action"
import { ContinuousRenewActionPod } from "../../../sign/authCredential/continuousRenew/action"

export type PasswordResetResource = Readonly<{
    reset: ResetComponent
    form: FormComponent
}>

export type PasswordResetLocationInfo = LocationActionLocationInfo & RegisterActionLocationInfo
export type PasswordResetForegroundActionPod = Readonly<{
    initContinuousRenew: ContinuousRenewActionPod
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
