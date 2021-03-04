import { ApplicationStateAction } from "../../../../../../../../z_vendor/getto-application/action/action"

import { ResetMethod, ResetPod } from "../../../method"
import { GetSecureScriptPathMethod } from "../../../../../../common/secureScriptPath/get/method"
import { StartContinuousRenewMethod } from "../../../../../../kernel/authInfo/common/startContinuousRenew/method"

import { ResetEvent } from "../../../event"
import { StartContinuousRenewEvent } from "../../../../../../kernel/authInfo/common/startContinuousRenew/event"

import { ResetFields } from "../../../data"
import {
    LoadSecureScriptError,
    ConvertSecureScriptResult,
} from "../../../../../../common/secureScriptPath/get/data"
import { ConvertBoardResult } from "../../../../../../../../z_vendor/getto-application/board/kernel/data"

export interface CoreAction extends ApplicationStateAction<CoreState> {
    submit(fields: ConvertBoardResult<ResetFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type CoreMaterial = CoreForegroundMaterial & CoreBackgroundMaterial

export type CoreForegroundMaterial = Readonly<{
    startContinuousRenew: StartContinuousRenewMethod
    getSecureScriptPath: GetSecureScriptPathMethod
}>
export type CoreBackgroundMaterial = Readonly<{
    reset: ResetMethod
}>
export type CoreBackgroundMaterialPod = Readonly<{
    initReset: ResetPod
}>

export type CoreState =
    | Readonly<{ type: "initial-reset" }>
    | Exclude<ResetEvent, { type: "succeed-to-reset" }>
    | Exclude<StartContinuousRenewEvent, { type: "succeed-to-start-continuous-renew" }>
    | Readonly<{ type: "try-to-load"; scriptPath: ConvertSecureScriptResult }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialCoreState: CoreState = {
    type: "initial-reset",
}
