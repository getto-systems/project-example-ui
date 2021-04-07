import { SaveAuthTicketEvent, StartContinuousRenewEvent } from "./event"

import { AuthTicket } from "../kernel/data"

export interface SaveAuthTicketMethod {
    (auth: AuthTicket, post: Post<SaveAuthTicketEvent>): void
}

export interface StartContinuousRenewMethod {
    (post: Post<StartContinuousRenewEvent>): void
}

interface Post<E> {
    (event: E): void
}
