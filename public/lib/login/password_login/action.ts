import { LoginEvent, LoginFields } from "./data"
import { Content } from "../field/data"

export interface Login {
    (collector: LoginCollector): LoginAction
}
export interface LoginAction {
    (post: Post<LoginEvent>): void
}
export interface LoginCollector {
    getFields(): Promise<Content<LoginFields>>
}

interface Post<T> {
    (event: T): void
}
