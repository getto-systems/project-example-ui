import { ApplicationStateAction } from "../../../../../../../z_vendor/getto-application/action/action"

import { ResetPasswordMethod, ResetPasswordPod } from "../../method"
import { GetScriptPathMethod } from "../../../../../common/secure/getScriptPath/method"
import {
    SaveAuthInfoMethod,
    StartContinuousRenewMethod,
} from "../../../../../kernel/authInfo/common/startContinuousRenew/method"

import { ResetPasswordEvent } from "../../event"
import { StartContinuousRenewEvent } from "../../../../../kernel/authInfo/common/startContinuousRenew/event"

import { ResetPasswordFields } from "../../data"
import {
    LoadScriptError,
    ConvertScriptPathResult,
} from "../../../../../common/secure/getScriptPath/data"
import { ConvertBoardResult } from "../../../../../../../z_vendor/getto-application/board/kernel/data"

export interface ResetPasswordCoreAction extends ApplicationStateAction<ResetPasswordCoreState> {
    submit(fields: ConvertBoardResult<ResetPasswordFields>): void
    loadError(err: LoadScriptError): void
}

export type ResetPasswordCoreMaterial = ResetPasswordCoreForegroundMaterial &
    ResetPasswordCoreBackgroundMaterial

export type ResetPasswordCoreForegroundMaterial = Readonly<{
    saveAuthInfo: SaveAuthInfoMethod
    startContinuousRenew: StartContinuousRenewMethod
    getSecureScriptPath: GetScriptPathMethod
}>
export type ResetPasswordCoreBackgroundMaterial = Readonly<{
    reset: ResetPasswordMethod
}>
export type ResetPasswordCoreBackgroundMaterialPod = Readonly<{
    initReset: ResetPasswordPod
}>

export type ResetPasswordCoreState =
    | Readonly<{ type: "initial-reset" }>
    | Exclude<ResetPasswordEvent, { type: "succeed-to-reset" }>
    | Exclude<StartContinuousRenewEvent, { type: "succeed-to-start-continuous-renew" }>
    | Readonly<{ type: "try-to-load"; scriptPath: ConvertScriptPathResult }>
    | Readonly<{ type: "load-error"; err: LoadScriptError }>

export const initialResetPasswordCoreState: ResetPasswordCoreState = {
    type: "initial-reset",
}
