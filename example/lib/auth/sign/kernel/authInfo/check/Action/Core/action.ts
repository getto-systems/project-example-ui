import { ApplicationStateAction } from "../../../../../../../z_vendor/getto-application/action/action"

import { GetScriptPathMethod } from "../../../../../common/secure/getScriptPath/method"
import {
    SaveAuthInfoMethod,
    StartContinuousRenewMethod,
} from "../../../common/startContinuousRenew/method"
import { RenewAuthInfoMethod, CheckAuthInfoMethod } from "../../method"

import { StartContinuousRenewEvent } from "../../../common/startContinuousRenew/event"
import { CheckAuthInfoEvent } from "../../event"

import {
    ConvertScriptPathResult,
    LoadScriptError,
} from "../../../../../common/secure/getScriptPath/data"

export interface CoreAction extends ApplicationStateAction<CoreState> {
    succeedToInstantLoad(): void
    failedToInstantLoad(): void
    loadError(err: LoadScriptError): void
}

export type CoreMaterial = Readonly<{
    renew: CheckAuthInfoMethod
    forceRenew: RenewAuthInfoMethod
    saveAuthInfo: SaveAuthInfoMethod
    startContinuousRenew: StartContinuousRenewMethod
    getSecureScriptPath: GetScriptPathMethod
}>

export type CoreState =
    | Readonly<{ type: "initial-renew" }>
    | Exclude<CheckAuthInfoEvent, { type: "try-to-instant-load" | "succeed-to-renew" }>
    | StartContinuousRenewEvent
    | Readonly<{ type: "try-to-instant-load"; scriptPath: ConvertScriptPathResult }>
    | Readonly<{ type: "try-to-load"; scriptPath: ConvertScriptPathResult }>
    | Readonly<{ type: "load-error"; err: LoadScriptError }>

export const initialCoreState: CoreState = {
    type: "initial-renew",
}
