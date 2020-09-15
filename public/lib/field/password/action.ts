import { PasswordCharacter, PasswordView, PasswordError, PasswordFieldEvent } from "./data"
import { Password } from "../../password/data"
import { InputValue, Content, Valid } from "../../input/data"

export interface PasswordFieldAction {
    initPasswordField(handler: PasswordFieldEventHandler): PasswordField
    initPasswordFieldDeprecated(): PasswordFieldDeprecated
}

export interface PasswordField {
    set(input: InputValue): void
    show(): void
    hide(): void
    validate(): void
}

export interface PasswordFieldEventHandler {
    handlePasswordFieldEvent(event: PasswordFieldEvent): void
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
