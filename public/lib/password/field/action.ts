import { PasswordFieldOperation, PasswordFieldEvent } from "./data"
import { InputValue } from "../../field/data"

export interface PasswordFieldAction {
    initPasswordField(): PasswordField
}

export interface PasswordField {
    sub: PasswordFieldEventSubscriber
    trigger(operation: PasswordFieldOperation): void
    set(input: InputValue): void
    show(): void
    hide(): void
    validate(): void
}

export interface PasswordFieldEventPublisher {
    postPasswordFieldEvent(event: PasswordFieldEvent): void
}

export interface PasswordFieldEventSubscriber {
    onPasswordFieldEvent(post: Post<PasswordFieldEvent>): void
}

interface Post<T> {
    (state: T): void
}
