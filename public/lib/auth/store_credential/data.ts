import { StoreError } from "../../credential/data"

export type StoreCredentialComponentState =
    Readonly<{ type: "initial-store" }> |
    Readonly<{ type: "failed-to-store", err: StoreError }> |
    Readonly<{ type: "succeed-to-store" }>

export const initialStoreCredentialComponentState: StoreCredentialComponentState = { type: "initial-store" }
