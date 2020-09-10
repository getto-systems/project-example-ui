import { Password, PasswordCharacter, PasswordView, PasswordError, PasswordBoard, ValidPassword } from "./data";
import { InputValue, Content, Valid } from "../input/data";

export interface PasswordAction {
    initPasswordField(): PasswordField
    initPasswordRecord(): PasswordRecord
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

export interface PasswordRecord {
    // TODO history が必要なやつに実装したら必要なくなる
    addChangedListener(listener: PasswordListener): void

    currentBoard(): PasswordBoard

    input(password: Password): PasswordBoard
    change(): PasswordBoard

    show(): PasswordBoard
    hide(): PasswordBoard

    validate(): ValidPassword
    clear(): void
}

export interface PasswordListener {
    (password: Password): void
}
