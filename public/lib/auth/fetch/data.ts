import { CredentialEventHandler } from "../../credential/action"

import { TicketNonce, FetchError } from "../../credential/data"

export interface FetchComponent {
    init(stateChanged: Publisher<FetchComponentState>): void
    terminate(): void
    fetch(): Promise<void>
}

export type FetchComponentState =
    Readonly<{ type: "initial-fetch" }> |
    Readonly<{ type: "failed-to-fetch", err: FetchError }> |
    Readonly<{ type: "require-login" }> |
    Readonly<{ type: "succeed-to-fetch", ticketNonce: TicketNonce }>

export const initialFetchComponentState: FetchComponentState = { type: "initial-fetch" }

export interface FetchComponentEventHandler extends CredentialEventHandler {
    onStateChange(stateChanged: Publisher<FetchComponentState>): void
}

interface Publisher<T> {
    (state: T): void
}
