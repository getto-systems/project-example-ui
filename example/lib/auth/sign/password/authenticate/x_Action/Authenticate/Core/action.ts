import { ApplicationStateAction } from "../../../../../../../z_vendor/getto-application/action/action"

import { AuthenticateMethod } from "../../../method"
import { GetScriptPathMethod } from "../../../../../common/secure/getScriptPath/method"
import { SaveAuthInfoMethod, StartContinuousRenewMethod } from "../../../../../kernel/authInfo/common/startContinuousRenew/method"

import { AuthenticateEvent } from "../../../event"
import { StartContinuousRenewEvent } from "../../../../../kernel/authInfo/common/startContinuousRenew/event"

import {
    LoadScriptError,
    ConvertScriptPathResult,
} from "../../../../../common/secure/getScriptPath/data"
import { AuthenticateFields } from "../../../data"
import { ConvertBoardResult } from "../../../../../../../z_vendor/getto-application/board/kernel/data"

export interface CoreAction extends ApplicationStateAction<CoreState> {
    submit(fields: ConvertBoardResult<AuthenticateFields>): void
    loadError(err: LoadScriptError): void
}

export type CoreMaterial = CoreForegroundMaterial & CoreBackgroundMaterial

export type CoreForegroundMaterial = Readonly<{
    saveAuthInfo: SaveAuthInfoMethod
    startContinuousRenew: StartContinuousRenewMethod
    getSecureScriptPath: GetScriptPathMethod
}>
export type CoreBackgroundMaterial = Readonly<{
    authenticate: AuthenticateMethod
}>

export type CoreState =
    | Readonly<{ type: "initial-login" }>
    | Exclude<AuthenticateEvent, { type: "succeed-to-login" }>
    | Exclude<StartContinuousRenewEvent, { type: "succeed-to-start-continuous-renew" }>
    | Readonly<{ type: "try-to-load"; scriptPath: ConvertScriptPathResult }>
    | Readonly<{ type: "load-error"; err: LoadScriptError }>

export const initialCoreState: CoreState = {
    type: "initial-login",
}
