import { ApplicationAction } from "../../../../../../../common/vendor/getto-example/Application/action"

import { RegisterPasswordResetSessionMethod } from "../../../../../password/resetSession/register/method"
import { GetSecureScriptPathMethod } from "../../../../../secureScriptPath/get/method"
import { StartContinuousRenewAuthnInfoMethod } from "../../../../../authnInfo/startContinuousRenew/method"

import { RegisterPasswordResetSessionEvent } from "../../../../../password/resetSession/register/event"
import { StartContinuousRenewAuthnInfoEvent } from "../../../../../authnInfo/startContinuousRenew/event"

import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"
import { PasswordResetFields } from "../../../../../password/resetSession/register/data"
import {
    SecureScriptPath,
    LoadSecureScriptError,
} from "../../../../../secureScriptPath/get/data"

export interface RegisterPasswordResetSessionAction
    extends ApplicationAction<RegisterPasswordResetSessionActionState> {
    submit(fields: FormConvertResult<PasswordResetFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type RegisterPasswordResetSessionMaterial = RegisterPasswordResetSessionForegroundMaterial &
    RegisterPasswordResetSessionBackgroundMaterial

export type RegisterPasswordResetSessionForegroundMaterial = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoMethod
    getSecureScriptPath: GetSecureScriptPathMethod
}>
export type RegisterPasswordResetSessionBackgroundMaterial = Readonly<{
    register: RegisterPasswordResetSessionMethod
}>

export type RegisterPasswordResetSessionActionState =
    | Readonly<{ type: "initial-reset" }>
    | Exclude<RegisterPasswordResetSessionEvent, { type: "succeed-to-reset" }>
    | Exclude<
          StartContinuousRenewAuthnInfoEvent,
          { type: "succeed-to-start-continuous-renew" }
      >
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialRegisterPasswordResetSessionActionState: RegisterPasswordResetSessionActionState = {
    type: "initial-reset",
}
