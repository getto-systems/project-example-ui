import { ApplicationComponent } from "../../../../../common/getto-example/Application/component"

import { ForceRenew, Renew, SetContinuousRenew } from "../../../../login/credentialStore/action"
import { SecureScriptPath } from "../../../../common/application/action"

import { RenewError } from "../../../../login/credentialStore/data"
import { ScriptPath, LoadError } from "../../../../common/application/data"
import { StorageError } from "../../../../common/credential/data"

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
