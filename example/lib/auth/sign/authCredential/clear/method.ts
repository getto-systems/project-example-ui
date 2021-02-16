import { ClearAuthCredentialEvent } from "./event"

export interface ClearAuthCredentialMethod {
    (post: Post<ClearAuthCredentialEvent>): void
}

interface Post<E> {
    (event: E): void
}
