import { LoginContent, LoginEvent } from "./data"

export interface LoginAction {
    (content: LoginContent, post: Post<LoginEvent>): void
}

interface Post<T> {
    (event: T): void
}
