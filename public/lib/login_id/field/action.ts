import { LoginIDFieldEvent } from "./data"
import { InputValue } from "../../field/data"

export interface LoginIDFieldAction {
    set(input: InputValue, post: Post<LoginIDFieldEvent>): void
    validate(post: Post<LoginIDFieldEvent>): void
}

interface Post<T> {
    (event: T): void
}
