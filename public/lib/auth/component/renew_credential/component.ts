import { RenewResource } from "../../../credential/action"
import { PathAction } from "../../../application/action"

import { FetchError, StoreError, RenewError } from "../../../credential/data"
import { PagePathname, ScriptPath } from "../../../application/data"

export interface RenewCredentialInit {
    (actions: RenewCredentialActionSet, param: RenewCredentialParam): RenewCredentialComponent
}

export type RenewCredentialActionSet = Readonly<{
    renew: RenewResource
    path: PathAction
}>
export type RenewCredentialParam = Readonly<{
    pagePathname: PagePathname
}>

export interface RenewCredentialComponent {
    onStateChange(post: Post<RenewCredentialState>): void
    action(request: RenewCredentialRequest): void
}

export type RenewCredentialState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "try-to-instant-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "required-to-login" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-fetch", err: FetchError }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "succeed-to-renew", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: LoadError }> |
    Readonly<{ type: "error", err: string }>

export const initialRenewCredentialState: RenewCredentialState = { type: "initial" }

export type RenewCredentialRequest =
    Readonly<{ type: "renew" }> |
    Readonly<{ type: "failed-to-load", err: LoadError }> |
    Readonly<{ type: "succeed-to-instant-load" }>

export type LoadError =
    Readonly<{ type: "infra-error", err: string }>

interface Post<T> {
    (state: T): void
}
