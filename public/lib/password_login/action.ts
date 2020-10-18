import { LoginEvent } from "./data"
import { LoginID } from "../login_id/data"
import { Password } from "../password/data"
import { Content } from "../field/data"

export interface LoginAction {
    (post: Post<LoginEvent>): void
}

export interface LoginFieldCollector {
    loginID(): Promise<Content<LoginID>>
    password(): Promise<Content<Password>>
}

interface Post<T> {
    (event: T): void
}
