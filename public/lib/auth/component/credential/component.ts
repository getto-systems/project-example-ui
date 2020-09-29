import { LastAuth, StoreError, RenewError } from "../../../credential/data"
import { PagePathname, ScriptPath } from "../../../application/data"

export type CredentialParam = { CredentialParam: never }

export interface CredentialParamPacker {
    (param: Param): CredentialParam
}
type Param = Readonly<{
    pagePathname: PagePathname
    lastAuth: LastAuth
}>

export interface CredentialComponent {
    onStateChange(stateChanged: Post<CredentialState>): void
    init(): CredentialComponentResource
}
export type CredentialComponentResource = ComponentResource<CredentialOperation>

export type CredentialState =
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

export const initialCredentialState: CredentialState = { type: "initial" }

export type CredentialOperation =
    Readonly<{ type: "set-param", param: CredentialParam }> |
    Readonly<{ type: "renew" }> |
    Readonly<{ type: "failed-to-load", err: LoadError }> |
    Readonly<{ type: "succeed-to-instant-load" }>

export const initialCredentialRequest: Post<CredentialOperation> = (): void => {
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
