import { LoginEvent } from "./data"

export interface LoginAction {
    (post: Post<LoginEvent>): void
}

interface Post<T> {
    (event: T): void
}
