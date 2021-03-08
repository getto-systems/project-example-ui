import { ApplicationStateAction } from "../../../../../../z_vendor/getto-application/action/action"

import { GetScriptPathMethod } from "../../../../common/secure/get_script_path/method"
import {
    SaveAuthInfoMethod,
    StartContinuousRenewMethod,
} from "../../common/start_continuous_renew/method"
import { RenewAuthInfoMethod, CheckAuthInfoMethod } from "../../check/method"

import { StartContinuousRenewEvent } from "../../common/start_continuous_renew/event"
import { CheckAuthInfoEvent } from "../../check/event"

import {
    ConvertScriptPathResult,
    LoadScriptError,
} from "../../../../common/secure/get_script_path/data"

export interface CheckAuthInfoCoreAction extends ApplicationStateAction<CheckAuthInfoCoreState> {
    succeedToInstantLoad(): void
    failedToInstantLoad(): void
    loadError(err: LoadScriptError): void
}

export type CheckAuthInfoCoreMaterial = Readonly<{
    renew: CheckAuthInfoMethod
    forceRenew: RenewAuthInfoMethod
    saveAuthInfo: SaveAuthInfoMethod
    startContinuousRenew: StartContinuousRenewMethod
    getSecureScriptPath: GetScriptPathMethod
}>

export type CheckAuthInfoCoreState =
    | Readonly<{ type: "initial-check" }>
    | Exclude<CheckAuthInfoEvent, { type: "try-to-instant-load" | "succeed-to-renew" }>
    | StartContinuousRenewEvent
    | Readonly<{ type: "try-to-instant-load"; scriptPath: ConvertScriptPathResult }>
    | Readonly<{ type: "try-to-load"; scriptPath: ConvertScriptPathResult }>
    | Readonly<{ type: "load-error"; err: LoadScriptError }>

export const initialCheckAuthInfoCoreState: CheckAuthInfoCoreState = {
    type: "initial-check",
}
