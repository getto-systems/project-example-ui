import { LoginIDFieldEvent } from "./data"
import { InputValue } from "../data"

export interface LoginIDField {
    (): LoginIDFieldAction
}
export interface LoginIDFieldAction {
    set(input: InputValue, post: Post<LoginIDFieldEvent>): void
    validate(post: Post<LoginIDFieldEvent>): void
}

interface Post<T> {
    (event: T): void
}
