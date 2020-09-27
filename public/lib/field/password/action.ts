import { PasswordFieldOperation, PasswordFieldEvent } from "./data"

export interface PasswordFieldAction {
    initPasswordField(): PasswordField
}

export interface PasswordField {
    sub: PasswordFieldEventSubscriber
    trigger(operation: PasswordFieldOperation): void
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
