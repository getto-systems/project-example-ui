import { ApplicationAction } from "../../../../../common/vendor/getto-example/Application/action"

import { GetSecureScriptPathMethod } from "../../../secureScriptPath/get/method"
import {
    ForceRenewAuthnInfoMethod,
    RenewAuthnInfoMethod,
} from "../../../kernel/authnInfo/renew/method"
import {
    ForceStartContinuousRenewAuthnInfoMethod,
    StartContinuousRenewAuthnInfoMethod,
} from "../../../kernel/authnInfo/startContinuousRenew/method"

import { RenewAuthnInfoEvent } from "../../../kernel/authnInfo/renew/event"

import {
    SecureScriptPath,
    LoadSecureScriptError,
} from "../../../secureScriptPath/get/data"
import { StartContinuousRenewAuthnInfoEvent } from "../../../kernel/authnInfo/startContinuousRenew/event"

export interface RenewAuthnInfoAction extends ApplicationAction<RenewAuthnInfoState> {
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

export type RenewAuthnInfoState =
    | Readonly<{ type: "initial-renew" }>
    | Exclude<
          RenewAuthnInfoEvent,
          { type: "try-to-instant-load" } | { type: "succeed-to-renew" }
      >
    | StartContinuousRenewAuthnInfoEvent
    | Readonly<{ type: "try-to-instant-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>

export const initialRenewAuthnInfoState: RenewAuthnInfoState = {
    type: "initial-renew",
}
