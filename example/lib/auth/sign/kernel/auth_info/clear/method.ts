import { ClearAuthInfoEvent } from "./event"

export interface ClearAuthInfoMethod {
    (post: Post<ClearAuthInfoEvent>): void
}

interface Post<E> {
    (event: E): void
}
