import { RenewAction, SetContinuousRenewAction } from "../../../credential/action"
import { SecureScriptPathAction } from "../../../application/action"

import { StorageError, RenewError } from "../../../credential/data"
import { PagePathname, ScriptPath, LoadError } from "../../../application/data"

export interface RenewCredentialComponentFactory {
    (actions: RenewCredentialActionSet, param: RenewCredentialParam): RenewCredentialComponent
}

export type RenewCredentialActionSet = Readonly<{
    renew: RenewAction
    setContinuousRenew: SetContinuousRenewAction
    secureScriptPath: SecureScriptPathAction
}>
export type RenewCredentialParam = Readonly<{
    pagePathname: PagePathname
}>

export interface RenewCredentialComponent {
    onStateChange(post: Post<RenewCredentialState>): void
    action(request: RenewCredentialRequest): void
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

export type RenewCredentialRequest =
    | Readonly<{ type: "renew" }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "succeed-to-instant-load" }>

interface Post<T> {
    (state: T): void
}
