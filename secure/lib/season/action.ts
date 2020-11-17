import { LoadEvent } from "./data"

export interface LoadAction {
    (post: Post<LoadEvent>): void
}

interface Post<T> {
    (event: T): void
}