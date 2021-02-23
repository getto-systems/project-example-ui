import { ClearEvent } from "./event"

export interface ClearMethod {
    (post: Post<ClearEvent>): void
}

interface Post<E> {
    (event: E): void
}
