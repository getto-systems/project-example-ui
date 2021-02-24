import { ApplicationStateAction } from "../../../../../../../../z_getto/application/action"

import { GetSecureScriptPathMethod } from "../../../../../../common/secureScriptPath/get/method"
import {
    ForceStartContinuousRenewMethod,
    StartContinuousRenewMethod,
} from "../../../../common/startContinuousRenew/method"
import { ForceRenewMethod, RenewMethod } from "../../../method"

import { StartContinuousRenewEvent } from "../../../../common/startContinuousRenew/event"
import { RenewEvent } from "../../../event"

import {
    LoadSecureScriptError,
    SecureScriptPath,
} from "../../../../../../common/secureScriptPath/get/data"

export interface CoreAction extends ApplicationStateAction<CoreState> {
    succeedToInstantLoad(): void
    failedToInstantLoad(): void
    loadError(err: LoadSecureScriptError): void
}

export type CoreMaterial = Readonly<{
    renew: RenewMethod
    forceRenew: ForceRenewMethod
    startContinuousRenew: StartContinuousRenewMethod
    forceStartContinuousRenew: ForceStartContinuousRenewMethod
    getSecureScriptPath: GetSecureScriptPathMethod
}>

export type CoreState =
    | Readonly<{ type: "initial-renew" }>
    | Exclude<RenewEvent, { type: "try-to-instant-load" } | { type: "succeed-to-renew" }>
    | StartContinuousRenewEvent
    | Readonly<{ type: "try-to-instant-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialCoreState: CoreState = {
    type: "initial-renew",
}
