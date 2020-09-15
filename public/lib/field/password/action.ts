import { PasswordCharacter, PasswordView, PasswordError } from "./data"
import { Password } from "../../password/data"
import { InputValue, Content, Valid } from "../../input/data"

export interface PasswordFieldAction {
    initPasswordField(): PasswordField
}

export interface PasswordField {
    set(event: PasswordFieldEvent, input: InputValue): Content<Password>
    show(event: PasswordFieldEvent): void
    hide(event: PasswordFieldEvent): void
    validate(event: PasswordFieldEvent): Content<Password>
}

export interface PasswordFieldEvent {
    updated(valid: Valid<PasswordError>, character: PasswordCharacter, view: PasswordView): void
}
