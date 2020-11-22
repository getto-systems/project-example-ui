import { PasswordFieldEvent } from "./data"
import { InputValue } from "../../field/data"

export interface PasswordField {
    (): PasswordFieldAction
}
export interface PasswordFieldAction {
    set(input: InputValue, post: Post<PasswordFieldEvent>): void
    show(post: Post<PasswordFieldEvent>): void
    hide(post: Post<PasswordFieldEvent>): void
    validate(post: Post<PasswordFieldEvent>): void
}

interface Post<T> {
    (event: T): void
}
