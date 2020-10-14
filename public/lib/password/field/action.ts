import { PasswordFieldEvent } from "./data"
import { Password } from "../data"
import { Content, InputValue } from "../../field/data"

export interface PasswordFieldAction {
    set(input: InputValue): void
    show(): void
    hide(): void
    validate(): Content<Password>
}

export interface PasswordFieldFactory {
    (): PasswordFieldResource
}
export type PasswordFieldResource = Readonly<{
    action: PasswordFieldAction
    subscriber: PasswordFieldSubscriber
}>

export interface PasswordFieldSubscriber {
    onPasswordFieldEvent(post: Post<PasswordFieldEvent>): void
}

interface Post<T> {
    (event: T): void
}
