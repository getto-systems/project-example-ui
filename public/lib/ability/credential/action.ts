import {
    LoginID, LoginIDBoard, ValidLoginID,
    Nonce, ApiRoles,
    RenewState, StoreCredentialState,
} from "./data";

export interface CredentialAction {
    initLoginIDRecord(): LoginIDRecord

    renew(): Promise<RenewState>
    initStoreCredentialApi(): StoreCredentialApi
}

export interface LoginIDRecord {
    addChangedListener(listener: LoginIDListener): void

    currentBoard(): LoginIDBoard

    input(loginID: LoginID): LoginIDBoard
    change(): LoginIDBoard

    validate(): ValidLoginID
    clear(): void
}

export interface LoginIDListener {
    (loginID: LoginID): void
}

export interface StoreCredentialApi {
    currentState(): StoreCredentialState
    store(nonce: Nonce, roles: ApiRoles): StoreCredentialState
}
