import { ApplicationAction } from "../../../../../../../../z_getto/application/action"

import { ResetPasswordMethod, ResetPasswordPod } from "../../../method"
import { GetSecureScriptPathMethod } from "../../../../../../common/secureScriptPath/get/method"
import { StartContinuousRenewAuthnInfoMethod } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/method"

import { ResetPasswordEvent } from "../../../event"
import { StartContinuousRenewAuthnInfoEvent } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/event"

import { PasswordResetFields } from "../../../data"
import {
    SecureScriptPath,
    LoadSecureScriptError,
} from "../../../../../../common/secureScriptPath/get/data"
import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"

export interface ResetPasswordCoreAction extends ApplicationAction<ResetPasswordCoreState> {
    submit(fields: BoardConvertResult<PasswordResetFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type ResetPasswordCoreMaterial = ResetPasswordCoreForeground & ResetPasswordCoreBackground

export type ResetPasswordCoreForeground = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoMethod
    getSecureScriptPath: GetSecureScriptPathMethod
}>
export type ResetPasswordCoreBackground = Readonly<{
    reset: ResetPasswordMethod
}>
export type ResetPasswordCoreBackgroundPod = Readonly<{
    initReset: ResetPasswordPod
}>

export type ResetPasswordCoreState =
    | Readonly<{ type: "initial-reset" }>
    | Exclude<ResetPasswordEvent, { type: "succeed-to-reset" }>
    | Exclude<StartContinuousRenewAuthnInfoEvent, { type: "succeed-to-start-continuous-renew" }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialResetPasswordCoreState: ResetPasswordCoreState = {
    type: "initial-reset",
}
