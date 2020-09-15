import { PasswordCharacter, PasswordView, PasswordError } from "./data"
import { Password } from "../../password/data"
import { InputValue, Content, Valid } from "../../input/data"

export interface PasswordFieldAction {
    initPasswordFieldDeprecated(): PasswordFieldDeprecated
}

export interface PasswordFieldDeprecated {
    set(event: PasswordFieldEventPublisher, input: InputValue): Content<Password>
    show(event: PasswordFieldEventPublisher): void
    hide(event: PasswordFieldEventPublisher): void
    validate(event: PasswordFieldEventPublisher): Content<Password>
}

export interface PasswordFieldEventPublisher {
    updated(valid: Valid<PasswordError>, character: PasswordCharacter, view: PasswordView): void
}
