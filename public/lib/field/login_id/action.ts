import { LoginIDFieldError } from "./data"
import { LoginID } from "../../credential/data"
import { InputValue, Content, Valid } from "../../input/data"

export interface LoginIDFieldAction {
    initLoginIDField(): LoginIDField
}

export interface LoginIDField {
    set(event: LoginIDFieldEventPublisher, input: InputValue): Content<LoginID>
    validate(event: LoginIDFieldEventPublisher): Content<LoginID>
}

export interface LoginIDFieldEventPublisher {
    updated(valid: Valid<LoginIDFieldError>): void
}
