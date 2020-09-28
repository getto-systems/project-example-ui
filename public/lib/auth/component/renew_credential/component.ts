import { AuthResource, StoreError, RenewError } from "../../../credential/data"
import { PagePathname, ScriptPath } from "../../../script/data"

export type RenewCredentialParam = { RenewCredentialParam: never }

export interface RenewCredentialParamPacker {
    (param: Param): RenewCredentialParam
}
type Param = Readonly<{
    pagePathname: PagePathname
    authResource: AuthResource
}>

export interface RenewCredentialComponent {
    onStateChange(stateChanged: Post<RenewCredentialState>): void
    init(): RenewCredentialResource
}
export type RenewCredentialResource = Readonly<{
    trigger: RenewCredentialTrigger
    terminate: Terminate
}>

export type RenewCredentialState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "try-to-instant-load", scriptPath: ScriptPath }> |
    Readonly<{ type: "required-to-login" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "succeed-to-renew", scriptPath: ScriptPath }> |
    Readonly<{ type: "failed-to-load", err: LoadError }> |
    Readonly<{ type: "error", err: string }>

export const initialRenewCredentialState: RenewCredentialState = { type: "initial" }

export type RenewCredentialOperation =
    Readonly<{ type: "set-param", param: RenewCredentialParam }> |
    Readonly<{ type: "renew" }> |
    Readonly<{ type: "failed-to-load", err: LoadError }> |
    Readonly<{ type: "succeed-to-instant-load" }>

export type LoadError =
    Readonly<{ type: "infra-error", err: string }>

export interface RenewCredentialTrigger {
    (operation: RenewCredentialOperation): Done
}

export type Done = { Done: never }
export const done: Done = true as true & Done

export const initialRenewCredentialTrigger: RenewCredentialTrigger = (_operation: RenewCredentialOperation): Done => {
    throw new Error("Component is not initialized. use: `init()`")
}

interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}
