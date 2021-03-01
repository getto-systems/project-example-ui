import { ForceRenewEvent, RenewEvent } from "./event"

export interface RenewMethod {
    (post: Post<RenewEvent>): void
}

export interface ForceRenewMethod {
    (post: Post<ForceRenewEvent>): void
}

interface Post<E> {
    (event: E): void
}
