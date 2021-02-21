import { ApplicationAction } from "../../../../../../../../z_getto/application/action"

import { RegisterPasswordMethod } from "../../../method"
import { GetSecureScriptPathMethod } from "../../../../../../common/secureScriptPath/get/method"
import { StartContinuousRenewAuthnInfoMethod } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/method"

import { RegisterPasswordEvent } from "../../../event"
import { StartContinuousRenewAuthnInfoEvent } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/event"

import { FormConvertResult } from "../../../../../../../../z_getto/getto-form/form/data"
import { PasswordResetFields } from "../../../data"
import {
    SecureScriptPath,
    LoadSecureScriptError,
} from "../../../../../../common/secureScriptPath/get/data"

export interface RegisterPasswordCoreAction extends ApplicationAction<RegisterPasswordCoreState> {
    submit(fields: FormConvertResult<PasswordResetFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type RegisterPasswordCoreMaterial = RegisterPasswordCoreForeground &
    RegisterPasswordCoreBackground

export type RegisterPasswordCoreForeground = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoMethod
    getSecureScriptPath: GetSecureScriptPathMethod
}>
export type RegisterPasswordCoreBackground = Readonly<{
    register: RegisterPasswordMethod
}>

export type RegisterPasswordCoreState =
    | Readonly<{ type: "initial-reset" }>
    | Exclude<RegisterPasswordEvent, { type: "succeed-to-reset" }>
    | Exclude<
          StartContinuousRenewAuthnInfoEvent,
          { type: "succeed-to-start-continuous-renew" }
      >
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialRegisterPasswordCoreState: RegisterPasswordCoreState = {
    type: "initial-reset",
}
