export type LoginID = Readonly<{ loginID: Readonly<string> }>

export type LoginIDBoard =
    Readonly<{ err: Array<LoginIDValidationError> }>

export type LoginIDValidationError = "empty";

export type ValidLoginID =
    Readonly<{ valid: false }> |
    Readonly<{ valid: true, content: LoginID }>

export type NonceValue = Readonly<{ nonce: Readonly<string> }>
export type ApiRoles = Readonly<{ roles: Readonly<Array<Readonly<string>>> }>

export type RenewState =
    Readonly<{ success: false, err: RenewError }> |
    Readonly<{ success: true }>
export function renewFailure(err: RenewError): RenewState {
    return { success: false, err }
}
export const renewSuccess: RenewState = { success: true }

export type RenewError =
    Readonly<{ type: "empty-nonce" }> |
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "invalid-ticket" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>

export type StoreCredentialState =
    Readonly<{ state: "initial-store-credential" }> |
    Readonly<{ state: "try-to-store-credential", promise: Promise<StoreCredentialState> }> |
    Readonly<{ state: "failed-to-store-credential", err: StoreCredentialError }> |
    Readonly<{ state: "succeed-to-store-credential" }>
export const initialStoreCredential: StoreCredentialState = { state: "initial-store-credential" }
export function tryToStoreCredential(promise: Promise<StoreCredentialState>): StoreCredentialState {
    return { state: "try-to-store-credential", promise }
}
export function failedToStoreCredential(err: StoreCredentialError): StoreCredentialState {
    return { state: "failed-to-store-credential", err }
}
export const succeedToStoreCredential: StoreCredentialState = { state: "succeed-to-store-credential" }

export type StoreCredentialError =
    Readonly<{ type: "infra-error", err: string }>
