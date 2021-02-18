import { ComposeBoardValidateEvent } from "./event"

export interface ComposeBoardValidateMethod {
    (post: Post<ComposeBoardValidateEvent>): void
}

interface Post<E> {
    (event: E): void
}
