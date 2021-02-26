import { ApplicationStateAction } from "../../../../../../../z_vendor/getto-application/action/action"

import { AuthenticateMethod } from "../../../method"
import { GetSecureScriptPathMethod } from "../../../../../common/secureScriptPath/get/method"
import { StartContinuousRenewMethod } from "../../../../../kernel/authnInfo/common/startContinuousRenew/method"

import { AuthenticateEvent } from "../../../event"
import { StartContinuousRenewEvent } from "../../../../../kernel/authnInfo/common/startContinuousRenew/event"

import {
    SecureScriptPath,
    LoadSecureScriptError,
} from "../../../../../common/secureScriptPath/get/data"
import { AuthenticateFields } from "../../../data"
import { BoardConvertResult } from "../../../../../../../z_vendor/getto-application/board/kernel/data"

export interface CoreAction extends ApplicationStateAction<CoreState> {
    submit(fields: BoardConvertResult<AuthenticateFields>): void
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
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialCoreState: CoreState = {
    type: "initial-login",
}
