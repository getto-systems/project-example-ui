import { PasswordFieldEvent } from "./data"
import { InputValue } from "../data"

export type PasswordFieldAction = Readonly<{
    password: PasswordFieldPod
}>

export interface PasswordFieldPod {
    (): PasswordField
}
export interface PasswordField {
    set(input: InputValue, post: Post<PasswordFieldEvent>): void
    show(post: Post<PasswordFieldEvent>): void
    hide(post: Post<PasswordFieldEvent>): void
    validate(post: Post<PasswordFieldEvent>): void
}

interface Post<T> {
    (event: T): void
}
