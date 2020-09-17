import { TicketNonce, FetchError } from "../../credential/data"

export type FetchCredentialComponentState =
    Readonly<{ type: "initial-fetch" }> |
    Readonly<{ type: "failed-to-fetch", err: FetchError }> |
    Readonly<{ type: "unauthorized" }> |
    Readonly<{ type: "succeed-to-fetch", ticketNonce: TicketNonce }>

export const initialFetchCredentialComponentState: FetchCredentialComponentState = { type: "initial-fetch" }

interface Publisher<T> {
    (state: T): void
}
