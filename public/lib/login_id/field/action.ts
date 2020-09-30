import { LoginIDFieldOperation, LoginIDFieldEvent } from "./data"
import { InputValue } from "../../field/data"

export interface LoginIDFieldAction {
    initLoginIDField(): LoginIDField
}

export interface LoginIDField {
    sub: LoginIDFieldEventSubscriber
    trigger(operation: LoginIDFieldOperation): void
    set(input: InputValue): void
    validate(): void
}

export interface LoginIDFieldEventPublisher {
    postLoginIDFieldEvent(event: LoginIDFieldEvent): void
}

export interface LoginIDFieldEventSubscriber {
    onLoginIDFieldEvent(post: Post<LoginIDFieldEvent>): void
}

interface Post<T> {
    (state: T): void
}
