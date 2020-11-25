import { RenewAction, SetContinuousRenewAction } from "../../../credential/action"
import { SecureScriptPathAction } from "../../../application/action"

import { StorageError, RenewError } from "../../../credential/data"
import { ScriptPath, LoadError } from "../../../application/data"

export interface RenewCredentialComponentFactory {
    (actions: RenewCredentialActionSet): RenewCredentialComponent
}

export type RenewCredentialActionSet = Readonly<{
    renew: RenewAction
    setContinuousRenew: SetContinuousRenewAction
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
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "succeed-to-renew"; scriptPath: ScriptPath }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "error"; err: string }>

export const initialRenewCredentialState: RenewCredentialState = { type: "initial" }

interface Post<T> {
    (state: T): void
}
