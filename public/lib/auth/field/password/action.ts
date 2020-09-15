import { PasswordFieldAction, PasswordFieldEventPublisher } from "../../../field/password/action"

import { PasswordError, PasswordCharacter, PasswordView } from "../../../field/password/data"
import { Password } from "../../../password/data"
import { InputValue, Content, Valid } from "../../../input/data"

export interface PasswordFieldComponentAction {
    passwordField: PasswordFieldAction
}

export interface PasswordFieldComponentDeprecated {
    initialState: PasswordFieldComponentState

    onChange(changed: PasswordContentHandler): void

    validate(event: PasswordFieldComponentEventPublisher): Promise<void>
    set(event: PasswordFieldComponentEventPublisher, password: InputValue): Promise<void>
    show(event: PasswordFieldComponentEventPublisher): Promise<void>
    hide(event: PasswordFieldComponentEventPublisher): Promise<void>
}

export type PasswordFieldComponentState =
    Readonly<{ type: "input-password", result: Valid<PasswordError>, character: PasswordCharacter, view: PasswordView }>

export interface PasswordFieldComponentEventPublisher extends PasswordFieldEventPublisher { } // eslint-disable-line @typescript-eslint/no-empty-interface

export interface PasswordFieldComponentEventInit {
    (stateChanged: PasswordFieldComponentStateHandler): PasswordFieldComponentEventPublisher
}

export interface PasswordFieldComponentStateHandler {
    (state: PasswordFieldComponentState): void
}

export interface PasswordContentHandler {
    (content: Content<Password>): void
}
