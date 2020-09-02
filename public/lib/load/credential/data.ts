export type LoginID = Readonly<{ loginID: Readonly<string> }>

export type LoginIDValidationError = "empty";

export type NonceValue = Readonly<{ nonce: Readonly<string> }>
export type ApiRoles = Readonly<{ roles: Readonly<Array<Readonly<string>>> }>

export type Nonce =
    Readonly<{ found: false }> |
    Readonly<{ found: true, value: NonceValue }>
export const nonceNotFound: Nonce = { found: false }
export function nonce(nonce: NonceValue): Nonce {
    if (nonce.nonce === "") {
        return nonceNotFound;
    }
    return { found: true, value: nonce }
}

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

export type StoreState =
    Readonly<{ success: false, err: StoreError }> |
    Readonly<{ success: true }>
export function loginFailure(err: StoreError): StoreState {
    return { success: false, err }
}
export const loginSuccess: StoreState = { success: true }

export type StoreError =
    Readonly<{ type: "infra-error", err: string }>
