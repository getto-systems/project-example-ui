import { PasswordFieldEvent } from "./data"
import { InputValue } from "../../input/data"

export interface PasswordFieldAction {
    initPasswordField(handler: PasswordFieldEventHandler): PasswordField
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
