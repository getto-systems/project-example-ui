import { ApplicationStateAction } from "../../../../../../../../z_getto/application/action"

import { ResetMethod, ResetPod } from "../../../method"
import { GetSecureScriptPathMethod } from "../../../../../../common/secureScriptPath/get/method"
import { StartContinuousRenewAuthnInfoMethod } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/method"

import { ResetEvent } from "../../../event"
import { StartContinuousRenewAuthnInfoEvent } from "../../../../../../kernel/authnInfo/common/startContinuousRenew/event"

import { ResetFields } from "../../../data"
import {
    SecureScriptPath,
    LoadSecureScriptError,
} from "../../../../../../common/secureScriptPath/get/data"
import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"

export interface CoreAction extends ApplicationStateAction<CoreState> {
    submit(fields: BoardConvertResult<ResetFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type CoreMaterial = CoreForegroundMaterial & CoreBackgroundMaterial

export type CoreForegroundMaterial = Readonly<{
    startContinuousRenew: StartContinuousRenewAuthnInfoMethod
    getSecureScriptPath: GetSecureScriptPathMethod
}>
export type CoreBackgroundMaterial = Readonly<{
    reset: ResetMethod
}>
export type CoreBackgroundPod = Readonly<{
    initReset: ResetPod
}>

export type CoreState =
    | Readonly<{ type: "initial-reset" }>
    | Exclude<ResetEvent, { type: "succeed-to-reset" }>
    | Exclude<StartContinuousRenewAuthnInfoEvent, { type: "succeed-to-start-continuous-renew" }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialCoreState: CoreState = {
    type: "initial-reset",
}
