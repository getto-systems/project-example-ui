import { LoginID, LoginIDError, AuthCredential, RenewError, StoreError } from "./data";
import { InputValue, Content, Valid } from "../input/data";

export interface AuthCredentialAction {
    initLoginIDField(): LoginIDField

    renew(event: RenewEvent): Promise<RenewResult>
    store(event: StoreEvent, authCredential: AuthCredential): Promise<void>
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
    failedToStore(err: StoreError): void
    succeedToStore(): void
}
