import { ApplicationStateAction } from "../../../../../../../z_vendor/getto-application/action/action"

import { GetSecureScriptPathMethod } from "../../../../../common/secureScriptPath/get/method"
import {
    ForceStartContinuousRenewMethod,
    StartContinuousRenewMethod,
} from "../../../common/startContinuousRenew/method"
import { RenewAuthInfoMethod, CheckAuthInfoMethod } from "../../method"

import { StartContinuousRenewEvent } from "../../../common/startContinuousRenew/event"
import { CheckAuthInfoEvent } from "../../event"

import {
    LoadSecureScriptError,
    SecureScriptPath,
} from "../../../../../common/secureScriptPath/get/data"

export interface CoreAction extends ApplicationStateAction<CoreState> {
    succeedToInstantLoad(): void
    failedToInstantLoad(): void
    loadError(err: LoadSecureScriptError): void
}

export type CoreMaterial = Readonly<{
    renew: CheckAuthInfoMethod
    forceRenew: RenewAuthInfoMethod
    startContinuousRenew: StartContinuousRenewMethod
    forceStartContinuousRenew: ForceStartContinuousRenewMethod
    getSecureScriptPath: GetSecureScriptPathMethod
}>

export type CoreState =
    | Readonly<{ type: "initial-renew" }>
    | Exclude<CheckAuthInfoEvent, { type: "try-to-instant-load" } | { type: "succeed-to-renew" }>
    | StartContinuousRenewEvent
    | Readonly<{ type: "try-to-instant-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialCoreState: CoreState = {
    type: "initial-renew",
}
