import { ApplicationStateAction } from "../../../../../../../z_vendor/getto-application/action/action"

import { AuthenticateMethod } from "../../../method"
import { GetSecureScriptPathMethod } from "../../../../../common/secureScriptPath/get/method"
import { StartContinuousRenewMethod } from "../../../../../kernel/authInfo/common/startContinuousRenew/method"

import { AuthenticateEvent } from "../../../event"
import { StartContinuousRenewEvent } from "../../../../../kernel/authInfo/common/startContinuousRenew/event"

import {
    LoadSecureScriptError,
    ConvertSecureScriptResult,
} from "../../../../../common/secureScriptPath/get/data"
import { AuthenticateFields } from "../../../data"
import { ConvertBoardResult } from "../../../../../../../z_vendor/getto-application/board/kernel/data"

export interface CoreAction extends ApplicationStateAction<CoreState> {
    submit(fields: ConvertBoardResult<AuthenticateFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type CoreMaterial = CoreForegroundMaterial & CoreBackgroundMaterial

export type CoreForegroundMaterial = Readonly<{
    startContinuousRenew: StartContinuousRenewMethod
    getSecureScriptPath: GetSecureScriptPathMethod
}>
export type CoreBackgroundMaterial = Readonly<{
    authenticate: AuthenticateMethod
}>

export type CoreState =
    | Readonly<{ type: "initial-login" }>
    | Exclude<AuthenticateEvent, { type: "succeed-to-login" }>
    | Exclude<StartContinuousRenewEvent, { type: "succeed-to-start-continuous-renew" }>
    | Readonly<{ type: "try-to-load"; scriptPath: ConvertSecureScriptResult }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialCoreState: CoreState = {
    type: "initial-login",
}
