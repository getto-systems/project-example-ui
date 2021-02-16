import { ApplicationAction } from "../../../../../common/vendor/getto-example/Application/action"

import { GetSecureScriptPathMethod } from "../../../secureScriptPath/get/action"
import {
    ForceRenewAuthnInfoMethod,
    RenewAuthnInfoMethod,
} from "../../../authnInfo/renew/action"
import {
    ForceStartContinuousRenewAuthnInfoMethod,
    StartContinuousRenewAuthnInfoMethod,
} from "../../../authnInfo/startContinuousRenew/action"

import { RequestRenewAuthnInfoEvent } from "../../../authnInfo/renew/event"

import {
    SecureScriptPath,
    LoadSecureScriptError,
} from "../../../secureScriptPath/get/data"
import { StartContinuousRenewAuthnInfoEvent } from "../../../authnInfo/startContinuousRenew/event"

export interface RenewAuthnInfoAction
    extends ApplicationAction<RenewAuthnInfoActionState> {
    request(): void
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

export type RenewAuthnInfoActionState =
    | Readonly<{ type: "initial-renew" }>
    | Exclude<
          RequestRenewAuthnInfoEvent,
          { type: "try-to-instant-load" } | { type: "succeed-to-renew" }
      >
    | StartContinuousRenewAuthnInfoEvent
    | Readonly<{ type: "try-to-instant-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialRenewAuthnInfoAction3State: RenewAuthnInfoActionState = {
    type: "initial-renew",
}
