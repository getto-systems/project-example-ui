import { ApplicationAction } from "../../../../../../../common/vendor/getto-example/Application/action"

import { RegisterPasswordMethod } from "../../../../../password/resetSession/register/method"
import { GetSecureScriptPathMethod } from "../../../../../common/secureScriptPath/get/method"
import { StartContinuousRenewAuthnInfoMethod } from "../../../../../kernel/authnInfo/startContinuousRenew/method"

import { RegisterPasswordEvent } from "../../../../../password/resetSession/register/event"
import { StartContinuousRenewAuthnInfoEvent } from "../../../../../kernel/authnInfo/startContinuousRenew/event"

import { FormConvertResult } from "../../../../../../../common/vendor/getto-form/form/data"
import { PasswordResetFields } from "../../../../../password/resetSession/register/data"
import {
    SecureScriptPath,
    LoadSecureScriptError,
} from "../../../../../common/secureScriptPath/get/data"

export interface RegisterPasswordAction extends ApplicationAction<RegisterPasswordState> {
    submit(fields: FormConvertResult<PasswordResetFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type RegisterPasswordMaterial = RegisterPasswordForeground &
    RegisterPasswordBackground

export type RegisterPasswordForeground = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoMethod
    getSecureScriptPath: GetSecureScriptPathMethod
}>
export type RegisterPasswordBackground = Readonly<{
    register: RegisterPasswordMethod
}>

export type RegisterPasswordState =
    | Readonly<{ type: "initial-reset" }>
    | Exclude<RegisterPasswordEvent, { type: "succeed-to-reset" }>
    | Exclude<
          StartContinuousRenewAuthnInfoEvent,
          { type: "succeed-to-start-continuous-renew" }
      >
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialRegisterPasswordState: RegisterPasswordState = {
    type: "initial-reset",
}
