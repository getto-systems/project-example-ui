import { ClearAuthnInfoEvent } from "./event"

export interface ClearAuthnInfoMethod {
    (post: Post<ClearAuthnInfoEvent>): void
}

interface Post<E> {
    (event: E): void
}
