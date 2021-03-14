import { ApplicationStateAction } from "../../../../../../z_vendor/getto-application/action/action"

import { ResetPasswordMethod, ResetPasswordPod } from "../../reset/method"
import { GetScriptPathMethod } from "../../../../common/secure/get_script_path/method"
import {
    SaveAuthTicketMethod,
    StartContinuousRenewMethod,
} from "../../../../auth_ticket/start_continuous_renew/method"

import { ResetPasswordEvent } from "../../reset/event"
import { StartContinuousRenewEvent } from "../../../../auth_ticket/start_continuous_renew/event"

import { ResetPasswordFields } from "../../reset/data"
import {
    LoadScriptError,
    ConvertScriptPathResult,
} from "../../../../common/secure/get_script_path/data"
import { ConvertBoardResult } from "../../../../../../z_vendor/getto-application/board/kernel/data"

export interface ResetPasswordCoreAction extends ApplicationStateAction<ResetPasswordCoreState> {
    submit(fields: ConvertBoardResult<ResetPasswordFields>): void
    loadError(err: LoadScriptError): void
}

export type ResetPasswordCoreMaterial = ResetPasswordCoreForegroundMaterial &
    ResetPasswordCoreBackgroundMaterial

export type ResetPasswordCoreForegroundMaterial = Readonly<{
    save: SaveAuthTicketMethod
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
