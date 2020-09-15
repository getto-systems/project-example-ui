import { LoginIDFieldEvent, LoginIDFieldError } from "./data"
import { LoginID } from "../../credential/data"
import { InputValue, Content, Valid } from "../../input/data"

export interface LoginIDFieldAction {
    initLoginIDField(): LoginIDField
    initLoginIDFieldDeprecated(): LoginIDFieldDeprecated
}

export interface LoginIDField {
    set(input: InputValue): Promise<void>
    validate(): Promise<void>
}

export interface LoginIDFieldEventHandler {
    handleLoginIDFieldEvent(event: LoginIDFieldEvent): void
}

export interface LoginIDFieldDeprecated {
    set(event: LoginIDFieldEventPublisher, input: InputValue): Content<LoginID>
    validate(event: LoginIDFieldEventPublisher): Content<LoginID>
}

export interface LoginIDFieldEventPublisher {
    updated(valid: Valid<LoginIDFieldError>): void
}
