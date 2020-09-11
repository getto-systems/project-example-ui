import { PasswordAction, PasswordEvent } from "../../../password/action"

import { Password, PasswordError, PasswordCharacter, PasswordView } from "../../../password/data"
import { InputValue, Content, Valid } from "../../../input/data"

export interface PasswordFieldComponentAction {
    password: PasswordAction
}

export interface PasswordFieldComponent {
    initialState: PasswordFieldComponentState
    onStateChange(stateChanged: PasswordFieldComponentStateHandler): void

    validate(): Promise<Content<Password>>
    setPassword(password: InputValue): Promise<void>
    showPassword(): Promise<void>
    hidePassword(): Promise<void>
}

export interface PasswordFieldComponentEvent extends PasswordEvent { }

export type PasswordFieldComponentState =
    Readonly<{ type: "input-password", result: Valid<PasswordError>, character: PasswordCharacter, view: PasswordView }>

export interface PasswordFieldComponentStateHandler {
    (state: PasswordFieldComponentState): void
}
