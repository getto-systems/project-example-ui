import {
    LoginID, LoginIDBoard, ValidLoginID,
    AuthCredential,
    RenewError,
    StoreError,
    RenewState,
    StoreCredentialState,
} from "./data";

export interface AuthCredentialAction {
    initLoginIDRecord(): LoginIDRecord

    renew(): Promise<RenewState>
    initStoreCredentialApi(): StoreCredentialApi

    renew_withEvent(event: RenewEvent): Promise<void>
}

export interface RenewEvent {
    tryToRenew(): void
    delayedToRenew(): void
    failedToRenew(err: RenewError): void
    tryToStore(): void
    failedToStore(err: StoreError): void
    succeedToRenew(): void
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
    store(authCredential: AuthCredential): StoreCredentialState
}
