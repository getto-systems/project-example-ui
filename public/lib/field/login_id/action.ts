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
    dispatchLoginIDFieldEvent(event: LoginIDFieldEvent): void
}

export interface LoginIDFieldEventSubscriber {
    onLoginIDFieldEvent(dispatch: Dispatcher<LoginIDFieldEvent>): void
}

interface Dispatcher<T> {
    (state: T): void
}
