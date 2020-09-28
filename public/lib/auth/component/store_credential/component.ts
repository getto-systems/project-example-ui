import { FetchError, StoreError, RenewError } from "../../../credential/data"
import { PagePathname } from "../../../script/data"

export interface StoreCredentialComponent {
    onStateChange(stateChanged: Post<StoreCredentialState>): void
    init(): Terminate
    setParam(param: StoreCredentialParam): void
    renew(): Promise<void>
}

export type StoreCredentialParam = { StoreCredentialParam: never }

export type StoreCredentialState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "failed-to-fetch", err: FetchError }> |
    Readonly<{ type: "try-to-instant-load", pagePathname: PagePathname }> |
    Readonly<{ type: "required-to-login" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "try-to-load", pagePathname: PagePathname }> |
    Readonly<{ type: "error", err: string }>

export const initialStoreCredentialState: StoreCredentialState = { type: "initial" }

interface Post<T> {
    (state: T): void
}

interface Terminate {
    (): void
}
