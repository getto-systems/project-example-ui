import { CredentialEventHandler } from "../../credential/action"

import { TicketNonce, FetchError } from "../../credential/data"

export interface FetchCredentialComponent {
    hook(stateChanged: Publisher<FetchCredentialComponentState>): void
    init(stateChanged: Publisher<FetchCredentialComponentState>): void
    terminate(): void
    fetch(): Promise<void>
}

export type FetchCredentialComponentState =
    Readonly<{ type: "initial-fetch" }> |
    Readonly<{ type: "failed-to-fetch", err: FetchError }> |
    Readonly<{ type: "unauthorized" }> |
    Readonly<{ type: "succeed-to-fetch", ticketNonce: TicketNonce }>

export const initialFetchCredentialComponentState: FetchCredentialComponentState = { type: "initial-fetch" }

export interface FetchCredentialComponentEventHandler extends CredentialEventHandler {
    onStateChange(stateChanged: Publisher<FetchCredentialComponentState>): void
}

interface Publisher<T> {
    (state: T): void
}
