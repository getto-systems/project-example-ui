import { AuthCredential, TicketNonce, FetchEvent, RenewEvent, RenewError, StoreEvent, StoreError } from "./data"

export interface CredentialAction {
    fetch(): Promise<void>
    renew(ticketNonce: TicketNonce): Promise<void>
    store(authCredential: AuthCredential): Promise<void>

    renewDeprecated(event: RenewEventPublisher): Promise<RenewResult>
    storeDeprecated(event: StoreEventPublisher, authCredential: AuthCredential): Promise<void>
}

export interface CredentialEventHandler {
    handleFetchEvent(event: FetchEvent): void
    handleRenewEvent(event: RenewEvent): void
    handleStoreEvent(event: StoreEvent): void
}

export type RenewResult =
    Readonly<{ success: false }> |
    Readonly<{ success: true, authCredential: AuthCredential }>

export interface RenewEventPublisher {
    tryToRenew(): void
    delayedToRenew(): void
    failedToRenew(err: RenewError): void
}

export interface StoreEventPublisher {
    failedToStore(err: StoreError): void
    succeedToStore(): void
}
