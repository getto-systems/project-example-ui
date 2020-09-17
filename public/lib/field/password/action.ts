import { Password } from "../../password/data"
import { PasswordFieldOperation, PasswordFieldEvent } from "./data"
import { InputValue, Content } from "../../field/data"

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
    publishPasswordFieldEvent(event: PasswordFieldEvent): void
}

export interface PasswordFieldEventSubscriber {
    onPasswordFieldStateChanged(stateChanged: Publisher<PasswordFieldEvent>): void
    onPasswordFieldContentChanged(contentChanged: Publisher<Content<Password>>): void
}

interface Publisher<T> {
    (state: T): void
}
