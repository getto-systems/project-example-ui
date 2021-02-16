import { ApplicationComponent } from "../../../../../vendor/getto-example/Application/component"

import { AuthLocationAction } from "../../../authLocation/action"
import { RenewAuthCredentialAction } from "../../../authCredential/renew/action"
import { ContinuousRenewAuthCredentialAction } from "../../../authCredential/continuousRenew/action"

import { StorageError } from "../../../../../common/storage/data"
import { RequestRenewAuthCredentialError } from "../../../authCredential/renew/data"
import { SecureScriptPath, LoadSecureScriptError } from "../../../authLocation/data"

export interface RenewAuthCredentialComponent
    extends ApplicationComponent<RenewAuthCredentialComponentState> {
    request(): void
    succeedToInstantLoad(): void
    failedToInstantLoad(): void
    loadError(err: LoadSecureScriptError): void
}

export type RenewAuthCredentialMaterial = Readonly<{
    renew: RenewAuthCredentialAction
    continuousRenew: ContinuousRenewAuthCredentialAction
    location: AuthLocationAction
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
