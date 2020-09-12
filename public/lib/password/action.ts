import { Password, PasswordCharacter, PasswordView, PasswordError } from "./data"
import { InputValue, Content, Valid } from "../input/data"

export interface PasswordAction {
    initPasswordField(): PasswordField
}

export interface PasswordField {
    set(event: PasswordEvent, input: InputValue): Content<Password>
    show(event: PasswordEvent): void
    hide(event: PasswordEvent): void
    validate(event: PasswordEvent): Content<Password>
}

export interface PasswordEvent {
    updated(valid: Valid<PasswordError>, character: PasswordCharacter, view: PasswordView): void
}
