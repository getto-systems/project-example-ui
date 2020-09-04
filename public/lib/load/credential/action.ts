import {
    LoginID, LoginIDBoard, ValidLoginID,
    NonceValue, ApiRoles,
    RenewState, StoreState,
} from "./data";

export interface CredentialAction {
    initLoginIDRecord(): LoginIDRecord

    store(nonce: NonceValue, roles: ApiRoles): Promise<StoreState>
    renew(): Promise<RenewState>
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
