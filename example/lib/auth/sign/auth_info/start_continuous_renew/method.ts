import { StartContinuousRenewEvent } from "./event"

import { AuthTicket } from "../kernel/data"
import { SaveAuthTicketResult } from "./data"

export interface SaveAuthTicketMethod {
    (auth: AuthTicket): SaveAuthTicketResult
}

export interface StartContinuousRenewMethod {
    (post: Post<StartContinuousRenewEvent>): void
}

interface Post<E> {
    (event: E): void
}
