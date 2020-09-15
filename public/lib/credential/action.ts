import { AuthCredential, RenewError, StoreError } from "./data"

export interface CredentialAction {
    renew(event: RenewEvent): Promise<RenewResult>
    store(event: StoreEvent, authCredential: AuthCredential): Promise<void>
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
