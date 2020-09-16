import { Password } from "../../password/data"
import { PasswordFieldEvent } from "./data"
import { InputValue, Content } from "../../input/data"

export interface PasswordFieldAction {
    initPasswordField(): [PasswordField, PasswordFieldEventSubscriber]
}

export interface PasswordField {
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
