import { RenewAuthInfoEvent, CheckAuthInfoEvent } from "./event"

export interface CheckAuthInfoMethod {
    (post: Post<CheckAuthInfoEvent>): void
}

export interface RenewAuthInfoMethod {
    (post: Post<RenewAuthInfoEvent>): void
}

interface Post<E> {
    (event: E): void
}
