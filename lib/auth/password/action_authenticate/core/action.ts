import { ApplicationStateAction } from "../../../../z_vendor/getto-application/action/action"

import { AuthenticatePasswordMethod } from "../../authenticate/method"
import { GetScriptPathMethod } from "../../../common/secure/get_script_path/method"
import {
    SaveAuthTicketMethod,
    StartContinuousRenewMethod,
} from "../../../auth_ticket/start_continuous_renew/method"

import { AuthenticatePasswordEvent } from "../../authenticate/event"
import { StartContinuousRenewEvent } from "../../../auth_ticket/start_continuous_renew/event"

import {
    LoadScriptError,
    ConvertScriptPathResult,
} from "../../../common/secure/get_script_path/data"
import { AuthenticatePasswordFields } from "../../authenticate/data"
import { ConvertBoardResult } from "../../../../z_vendor/getto-application/board/kernel/data"

export interface AuthenticatePasswordCoreAction
    extends ApplicationStateAction<AuthenticatePasswordCoreState> {
    submit(fields: ConvertBoardResult<AuthenticatePasswordFields>): void
    loadError(err: LoadScriptError): void
}

export type AuthenticatePasswordCoreMaterial = AuthenticatePasswordCoreForegroundMaterial &
    AuthenticatePasswordCoreBackgroundMaterial

export type AuthenticatePasswordCoreForegroundMaterial = Readonly<{
    save: SaveAuthTicketMethod
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
