import {
    LoginID, LoginIDBoard, ValidLoginID, LoginIDError,
    AuthCredential,
    RenewError,
    StoreError,
    RenewState,
    StoreCredentialState,
} from "./data";
import { InputValue, Content, Valid } from "../input/data";

export interface AuthCredentialAction {
    initLoginIDRecord(): LoginIDRecord
    initLoginIDField(): LoginIDField

    renew(): Promise<RenewState>
    initStoreCredentialApi(): StoreCredentialApi

    renew_withEvent(event: RenewEvent): Promise<RenewResult>
    store_withEvent(event: StoreEvent, authCredential: AuthCredential): Promise<void>
}

export interface LoginIDField {
    initialState(): [Valid<LoginIDError>]

    setLoginID(event: LoginIDEvent, input: InputValue): void
    validate(event: LoginIDEvent): Content<LoginID>

    toLoginID(): Content<LoginID>
}

export interface LoginIDEvent {
    updated(valid: Valid<LoginIDError>): void
}

export type RenewResult =
    Readonly<{ success: false }> |
    Readonly<{ success: true, authCredential: AuthCredential }>

export interface RenewEvent {
    tryToRenew(): void
    delayedToRenew(): void
    failedToRenew(err: RenewError): void
}

export interface StoreEvent {
    tryToStore(): void
    failedToStore(err: StoreError): void
    succeedToStore(): void
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
