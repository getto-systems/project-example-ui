import { PasswordFieldAction, PasswordFieldEvent } from "../../../field/password/action"

import { PasswordError, PasswordCharacter, PasswordView } from "../../../field/password/data"
import { Password } from "../../../password/data"
import { InputValue, Content, Valid } from "../../../input/data"

export interface PasswordFieldComponentAction {
    passwordField: PasswordFieldAction
}

export interface PasswordFieldComponent {
    initialState: PasswordFieldComponentState

    onChange(changed: PasswordContentHandler): void

    validate(event: PasswordFieldComponentEvent): Promise<void>
    set(event: PasswordFieldComponentEvent, password: InputValue): Promise<void>
    show(event: PasswordFieldComponentEvent): Promise<void>
    hide(event: PasswordFieldComponentEvent): Promise<void>
}

export type PasswordFieldComponentState =
    Readonly<{ type: "input-password", result: Valid<PasswordError>, character: PasswordCharacter, view: PasswordView }>

export interface PasswordFieldComponentEvent extends PasswordFieldEvent { } // eslint-disable-line @typescript-eslint/no-empty-interface

export interface PasswordFieldComponentEventInit {
    (stateChanged: PasswordFieldComponentStateHandler): PasswordFieldComponentEvent
}

export interface PasswordFieldComponentStateHandler {
    (state: PasswordFieldComponentState): void
}

export interface PasswordContentHandler {
    (content: Content<Password>): void
}
