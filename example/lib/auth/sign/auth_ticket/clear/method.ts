import { ClearAuthTicketEvent } from "./event"

export interface ClearAuthTicketMethod {
    (post: Post<ClearAuthTicketEvent>): void
}

interface Post<E> {
    (event: E): void
}
