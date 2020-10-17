import { LoginContent, LoginEvent } from "./data"

export interface LoginAction {
    (content: LoginContent, post: Post<LoginEvent>): void
}

export interface LoginFactory {
    (): LoginAction
}

interface Post<T> {
    (event: T): void
}
