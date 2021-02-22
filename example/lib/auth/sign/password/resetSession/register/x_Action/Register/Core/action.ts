import { ApplicationAction } from "../../../../../../../../z_getto/application/action"

import { RegisterPasswordMethod, RegisterPasswordPod } from "../../../method"
import { GetSecureScriptPathMethod } from "../../../../../../common/secureScriptPath/get/method"
import { StartContinuousRenewAuthnInfoMethod } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/method"

import { RegisterPasswordEvent } from "../../../event"
import { StartContinuousRenewAuthnInfoEvent } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/event"

import { PasswordResetFields } from "../../../data"
import {
    SecureScriptPath,
    LoadSecureScriptError,
} from "../../../../../../common/secureScriptPath/get/data"
import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"

export interface RegisterPasswordCoreAction extends ApplicationAction<RegisterPasswordCoreState> {
    submit(fields: BoardConvertResult<PasswordResetFields>): void
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
export type RegisterPasswordCoreBackgroundPod = Readonly<{
    initRegister: RegisterPasswordPod
}>

export type RegisterPasswordCoreState =
    | Readonly<{ type: "initial-reset" }>
    | Exclude<RegisterPasswordEvent, { type: "succeed-to-reset" }>
    | Exclude<StartContinuousRenewAuthnInfoEvent, { type: "succeed-to-start-continuous-renew" }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialRegisterPasswordCoreState: RegisterPasswordCoreState = {
    type: "initial-reset",
}
