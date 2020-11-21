import { LoginEvent, LoginFields } from "./data"
import { Content } from "../field/data"

export interface Login {
    (collectFields: LoginCollector): LoginAction
}
export interface LoginAction {
    (post: Post<LoginEvent>): void
}
export interface LoginCollector {
    (): Promise<Content<LoginFields>>
}

interface Post<T> {
    (event: T): void
}
