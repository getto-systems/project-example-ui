import { Renew, SetContinuousRenew } from "../../login/renew/action"
import { LoadLastLogin, RemoveAuthCredential, StoreAuthCredential } from "../../common/credential/action"
import { SecureScriptPath } from "../../common/application/action"

import { RenewError } from "../../login/renew/data"
import { ScriptPath, LoadError } from "../../common/application/data"
import { StorageError } from "../../common/credential/data"

export interface RenewCredentialComponentFactory {
    (material: RenewCredentialMaterial): RenewCredentialComponent
}

export type RenewCredentialMaterial = Readonly<{
    renew: Renew
    setContinuousRenew: SetContinuousRenew
    loadLastLogin: LoadLastLogin
    storeAuthCredential: StoreAuthCredential
    removeAuthCredential: RemoveAuthCredential
    secureScriptPath: SecureScriptPath
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
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialRenewCredentialState: RenewCredentialState = { type: "initial" }

interface Post<T> {
    (state: T): void
}
