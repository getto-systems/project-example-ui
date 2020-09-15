import { LoginIDFieldError } from "./data"
import { LoginID } from "../../credential/data"
import { InputValue, Content, Valid } from "../../input/data"

export interface LoginIDFieldAction {
    initLoginIDField(): LoginIDField
}

export interface LoginIDField {
    set(event: LoginIDFieldEvent, input: InputValue): Content<LoginID>
    validate(event: LoginIDFieldEvent): Content<LoginID>
}

export interface LoginIDFieldEvent {
    updated(valid: Valid<LoginIDFieldError>): void
}
