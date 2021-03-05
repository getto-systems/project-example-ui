import { ApplicationStateAction } from "../../../../../../z_vendor/getto-application/action/action"

import { AuthenticatePasswordMethod } from "../../method"
import { GetScriptPathMethod } from "../../../../common/secure/getScriptPath/method"
import {
    SaveAuthInfoMethod,
    StartContinuousRenewMethod,
} from "../../../../kernel/authInfo/common/startContinuousRenew/method"

import { AuthenticatePasswordEvent } from "../../event"
import { StartContinuousRenewEvent } from "../../../../kernel/authInfo/common/startContinuousRenew/event"

import {
    LoadScriptError,
    ConvertScriptPathResult,
} from "../../../../common/secure/getScriptPath/data"
import { AuthenticatePasswordFields } from "../../data"
import { ConvertBoardResult } from "../../../../../../z_vendor/getto-application/board/kernel/data"

export interface AuthenticatePasswordCoreAction
    extends ApplicationStateAction<AuthenticatePasswordCoreState> {
    submit(fields: ConvertBoardResult<AuthenticatePasswordFields>): void
    loadError(err: LoadScriptError): void
}

export type AuthenticatePasswordCoreMaterial = AuthenticatePasswordCoreForegroundMaterial &
    AuthenticatePasswordCoreBackgroundMaterial

export type AuthenticatePasswordCoreForegroundMaterial = Readonly<{
    saveAuthInfo: SaveAuthInfoMethod
    startContinuousRenew: StartContinuousRenewMethod
    getSecureScriptPath: GetScriptPathMethod
}>
export type AuthenticatePasswordCoreBackgroundMaterial = Readonly<{
    authenticate: AuthenticatePasswordMethod
}>

export type AuthenticatePasswordCoreState =
    | Readonly<{ type: "initial-login" }>
    | Exclude<AuthenticatePasswordEvent, { type: "succeed-to-login" }>
    | Exclude<StartContinuousRenewEvent, { type: "succeed-to-start-continuous-renew" }>
    | Readonly<{ type: "try-to-load"; scriptPath: ConvertScriptPathResult }>
    | Readonly<{ type: "load-error"; err: LoadScriptError }>

export const initialAuthenticatePasswordCoreState: AuthenticatePasswordCoreState = {
    type: "initial-login",
}
