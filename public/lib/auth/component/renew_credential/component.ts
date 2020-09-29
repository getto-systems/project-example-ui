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
    init(): ComponentResource<RenewCredentialOperation>
}

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

export const initialRenewCredentialRequest: Post<RenewCredentialOperation> = (): void => {
    throw new Error("Component is not initialized. use: `init()`")
}

export type LoadError =
    Readonly<{ type: "infra-error", err: string }>

interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}

type ComponentResource<T> = Readonly<{
    request: Post<T>
    terminate: Terminate
}>
