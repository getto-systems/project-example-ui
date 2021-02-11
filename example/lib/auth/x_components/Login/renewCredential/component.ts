import { ApplicationComponent } from "../../../../sub/getto-example/x_components/Application/component"

import { ForceRenew, Renew, SetContinuousRenew } from "../../../login/renew/action"
import { SecureScriptPath } from "../../../common/application/action"

import { RenewError } from "../../../login/renew/data"
import { ScriptPath, LoadError } from "../../../common/application/data"
import { StorageError } from "../../../common/credential/data"

export interface RenewCredentialComponentFactory {
    (material: RenewCredentialMaterial): RenewCredentialComponent
}

export type RenewCredentialMaterial = Readonly<{
    renew: Renew
    forceRenew: ForceRenew
    setContinuousRenew: SetContinuousRenew
    secureScriptPath: SecureScriptPath
}>

export interface RenewCredentialComponent extends ApplicationComponent<RenewCredentialComponentState> {
    renew(): void
    succeedToInstantLoad(): void
    failedToInstantLoad(): void
    loadError(err: LoadError): void
}

export type RenewCredentialComponentState =
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

export const initialRenewCredentialComponentState: RenewCredentialComponentState = {
    type: "initial-renew",
}
