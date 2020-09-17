import { LoginID } from "../../credential/data"
import { LoginIDFieldOperation, LoginIDFieldEvent } from "./data"
import { InputValue, Content } from "../../field/data"

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
    publishLoginIDFieldEvent(event: LoginIDFieldEvent): void
}

export interface LoginIDFieldEventSubscriber {
    onLoginIDFieldStateChanged(stateChanged: Publisher<LoginIDFieldEvent>): void
    onLoginIDFieldContentChanged(contentChanged: Publisher<Content<LoginID>>): void
}

interface Publisher<T> {
    (state: T): void
}
