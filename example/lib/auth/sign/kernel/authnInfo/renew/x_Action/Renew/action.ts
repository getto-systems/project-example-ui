import { ApplicationStateAction } from "../../../../../../../z_getto/application/action"

import { GetSecureScriptPathMethod } from "../../../../../common/secureScriptPath/get/method"
import { ForceRenewAuthnInfoMethod, RenewAuthnInfoMethod } from "../../method"
import {
    ForceStartContinuousRenewAuthnInfoMethod,
    StartContinuousRenewAuthnInfoMethod,
} from "../../../common/startContinuousRenew/method"

import { RenewAuthnInfoEvent } from "../../event"

import {
    SecureScriptPath,
    LoadSecureScriptError,
} from "../../../../../common/secureScriptPath/get/data"
import { StartContinuousRenewAuthnInfoEvent } from "../../../common/startContinuousRenew/event"

export type RenewAuthnInfoEntryPoint = Readonly<{
    resource: RenewAuthnInfoResource
    terminate: { (): void }
}>
export type RenewAuthnInfoResource = Readonly<{
    renew: RenewAuthnInfoAction
}>

export interface RenewAuthnInfoAction extends ApplicationStateAction<RenewAuthnInfoState> {
    succeedToInstantLoad(): void
    failedToInstantLoad(): void
    loadError(err: LoadSecureScriptError): void
}

export type RenewAuthnInfoMaterial = Readonly<{
    renew: RenewAuthnInfoMethod
    forceRenew: ForceRenewAuthnInfoMethod
    startContinuousRenew: StartContinuousRenewAuthnInfoMethod
    forceStartContinuousRenew: ForceStartContinuousRenewAuthnInfoMethod
    getSecureScriptPath: GetSecureScriptPathMethod
}>

export type RenewAuthnInfoState =
    | Readonly<{ type: "initial-renew" }>
    | Exclude<RenewAuthnInfoEvent, { type: "try-to-instant-load" } | { type: "succeed-to-renew" }>
    | StartContinuousRenewAuthnInfoEvent
    | Readonly<{ type: "try-to-instant-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialRenewAuthnInfoState: RenewAuthnInfoState = {
    type: "initial-renew",
}
