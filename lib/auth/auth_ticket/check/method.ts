import { RenewAuthTicketEvent, CheckAuthTicketEvent } from "./event"

export interface CheckAuthTicketMethod {
    (post: Post<CheckAuthTicketEvent>): void
}

export interface RenewAuthTicketMethod {
    (post: Post<RenewAuthTicketEvent>): void
}

interface Post<E> {
    (event: E): void
}
