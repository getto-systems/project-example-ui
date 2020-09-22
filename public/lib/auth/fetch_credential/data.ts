import { TicketNonce, FetchError } from "../../credential/data"

export type FetchCredentialState =
    Readonly<{ type: "initial-fetch" }> |
    Readonly<{ type: "failed-to-fetch", err: FetchError }> |
    Readonly<{ type: "unauthorized" }> |
    Readonly<{ type: "succeed-to-fetch", ticketNonce: TicketNonce }>

export const initialFetchCredentialState: FetchCredentialState = { type: "initial-fetch" }

interface Publisher<T> {
    (state: T): void
}
