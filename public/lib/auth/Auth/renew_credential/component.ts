import { RenewAction, SetContinuousRenewAction } from "../../login/renew/action"
import { FindAction, RemoveAction, StoreAction } from "../../common/credential/action"
import { SecureScriptPathAction } from "../../common/application/action"

import { RenewError } from "../../login/renew/data"
import { ScriptPath, LoadError } from "../../common/application/data"
import { StorageError } from "../../common/credential/data"

export interface RenewCredentialComponentFactory {
    (material: RenewCredentialMaterial): RenewCredentialComponent
}

export type RenewCredentialMaterial = Readonly<{
    renew: RenewAction
    setContinuousRenew: SetContinuousRenewAction
    find: FindAction
    store: StoreAction
    remove: RemoveAction
    secureScriptPath: SecureScriptPathAction
}>

export interface RenewCredentialComponent {
    onStateChange(post: Post<RenewCredentialState>): void
    renew(): void
    succeedToInstantLoad(): void
    loadError(err: LoadError): void
}

export type RenewCredentialState =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "try-to-instant-load"; scriptPath: ScriptPath }>
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "succeed-to-renew"; scriptPath: ScriptPath }>
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "failed-to-find"; err: StorageError }>
    | Readonly<{ type: "failed-to-store"; err: StorageError }>
    | Readonly<{ type: "failed-to-remove"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialRenewCredentialState: RenewCredentialState = { type: "initial" }

interface Post<T> {
    (state: T): void
}
