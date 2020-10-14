import { LoginContent, LoginEvent } from "./data"

export interface LoginAction {
    (content: LoginContent): void
}

export interface LoginFactory {
    (): LoginResource
}
export type LoginResource = Readonly<{
    action: LoginAction
    subscriber: LoginSubscriber
}>

export interface LoginSubscriber {
    onLoginEvent(post: Post<LoginEvent>): void
}

interface Post<T> {
    (event: T): void
}
