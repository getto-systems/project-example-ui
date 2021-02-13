import { ApplicationComponent } from "../../../../../common/getto-example/Application/component"

import { ForceRenew, Renew, SetContinuousRenew } from "../../../../sign/authCredential/renew/action"
import { SecureScriptPath } from "../../../../sign/location/action"

import { RenewError } from "../../../../sign/authCredential/renew/data"
import { ScriptPath, LoadError } from "../../../../sign/location/data"
import { StorageError } from "../../../../../common/auth/storage/data"

export interface RenewComponentFactory {
    (material: RenewMaterial): RenewComponent
}

export type RenewMaterial = Readonly<{
    renew: Renew
    forceRenew: ForceRenew
    setContinuousRenew: SetContinuousRenew
    secureScriptPath: SecureScriptPath
}>

export interface RenewComponent extends ApplicationComponent<RenewComponentState> {
    request(): void
    succeedToInstantLoad(): void
    failedToInstantLoad(): void
    loadError(err: LoadError): void
}

export type RenewComponentState =
    | Readonly<{ type: "initial-renew" }>
    | Readonly<{ type: "try-to-instant-load"; scriptPath: ScriptPath }>
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "try-to-load"; scriptPath: ScriptPath }>
    | Readonly<{ type: "succeed-to-set-continuous-renew" }>
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialRenewComponentState: RenewComponentState = {
    type: "initial-renew",
}
