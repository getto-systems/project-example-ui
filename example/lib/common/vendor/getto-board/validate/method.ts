import { ValidateBoardEvent } from "./event"

export interface ValidateBoardMethod<E> {
    (post: Post<ValidateBoardEvent<E>>): void
}

interface Post<E> {
    (event: E): void
}
