import { ApplicationAction } from "../../../../../common/vendor/getto-example/Application/action"

import { GetSecureScriptPathAction } from "../../../secureScriptPath/get/action"
import { RenewAuthCredentialAction } from "../../../authCredential/renew/action"
import { StartContinuousRenewAuthCredentialAction } from "../../../authCredential/startContinuousRenew/action"

import { StorageError } from "../../../../../common/storage/data"
import { RequestRenewAuthCredentialError } from "../../../authCredential/renew/data"
import { SecureScriptPath, LoadSecureScriptError } from "../../../secureScriptPath/get/data"

export interface RenewAuthCredentialComponent
    extends ApplicationAction<RenewAuthCredentialComponentState> {
    request(): void
    succeedToInstantLoad(): void
    failedToInstantLoad(): void
    loadError(err: LoadSecureScriptError): void
}

export type RenewAuthCredentialMaterial = Readonly<{
    renew: RenewAuthCredentialAction
    continuousRenew: StartContinuousRenewAuthCredentialAction
    location: GetSecureScriptPathAction
}>

export type RenewAuthCredentialComponentState =
    | Readonly<{ type: "initial-renew" }>
    | Readonly<{ type: "try-to-instant-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "succeed-to-start-continuous-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RequestRenewAuthCredentialError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>
    | Readonly<{ type: "error"; err: string }>

export const initialRenewAuthCredentialComponentState: RenewAuthCredentialComponentState = {
    type: "initial-renew",
}
