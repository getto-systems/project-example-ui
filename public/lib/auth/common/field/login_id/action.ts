import { LoginIDFieldEvent } from "./data"
import { InputValue } from "../data"

export type LoginIDFieldAction = Readonly<{
    loginID: LoginIDFieldPod
}>

export interface LoginIDFieldPod {
    (): LoginIDField
}
export interface LoginIDField {
    set(input: InputValue, post: Post<LoginIDFieldEvent>): void
    validate(post: Post<LoginIDFieldEvent>): void
}

interface Post<T> {
    (event: T): void
}
