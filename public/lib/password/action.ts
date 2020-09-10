import { Password, PasswordCharacter, PasswordView, PasswordError } from "./data"
import { InputValue, Content, Valid } from "../input/data"

export interface PasswordAction {
    initPasswordField(): PasswordField
}

export interface PasswordField {
    initialState(): [Valid<PasswordError>, PasswordCharacter, PasswordView]

    setPassword(event: PasswordEvent, input: InputValue): void
    showPassword(event: PasswordEvent): void
    hidePassword(event: PasswordEvent): void
    validate(event: PasswordEvent): Content<Password>

    toPassword(): Content<Password>
}

export interface PasswordEvent {
    updated(valid: Valid<PasswordError>, character: PasswordCharacter, view: PasswordView): void
}
