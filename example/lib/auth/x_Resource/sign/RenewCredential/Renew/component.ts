import { ApplicationComponent } from "../../../../../vendor/getto-example/Application/component"

import { AuthLocationAction } from "../../../../sign/authLocation/action"

import { StorageError } from "../../../../../common/storage/data"
import { RequestRenewAuthCredentialError } from "../../../../sign/authCredential/renew/data"
import { SecureScriptPath, LoadSecureScriptError } from "../../../../sign/authLocation/data"
import { RenewAuthCredentialAction } from "../../../../sign/authCredential/renew/action"
import { ContinuousRenewAuthCredentialAction } from "../../../../sign/authCredential/continuousRenew/action"

export interface RenewComponentFactory {
    (material: RenewMaterial): RenewComponent
}

export type RenewMaterial = Readonly<{
    renew: RenewAuthCredentialAction
    continuousRenew: ContinuousRenewAuthCredentialAction
    location: AuthLocationAction
}>

export interface RenewComponent extends ApplicationComponent<RenewComponentState> {
    request(): void
    succeedToInstantLoad(): void
    failedToInstantLoad(): void
    loadError(err: LoadSecureScriptError): void
}

export type RenewComponentState =
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

export const initialRenewComponentState: RenewComponentState = {
    type: "initial-renew",
}
