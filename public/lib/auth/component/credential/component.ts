import { RenewResource } from "../../../credential/action"
import { PathAction } from "../../../application/action"

import { FetchError, StoreError, RenewError } from "../../../credential/data"
import { PagePathname, ScriptPath } from "../../../application/data"

export interface CredentialInit {
    (actions: CredentialActionSet, param: CredentialParam): CredentialComponent
}

export type CredentialActionSet = Readonly<{
    renew: RenewResource
    path: PathAction
}>
export type CredentialParam = Readonly<{
    pagePathname: PagePathname
}>

export interface CredentialComponent {
    onStateChange(post: Post<CredentialState>): void
    action(request: CredentialRequest): void
}

export type CredentialState =
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

export const initialCredentialState: CredentialState = { type: "initial" }

export type CredentialRequest =
    Readonly<{ type: "renew" }> |
    Readonly<{ type: "failed-to-load", err: LoadError }> |
    Readonly<{ type: "succeed-to-instant-load" }>

export type LoadError =
    Readonly<{ type: "infra-error", err: string }>

interface Post<T> {
    (state: T): void
}
