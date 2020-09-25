import { StoreError } from "../../../credential/data"

export type StoreCredentialState =
    Readonly<{ type: "initial-store" }> |
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "succeed-to-store" }>

export const initialStoreCredentialState: StoreCredentialState = { type: "initial-store" }
