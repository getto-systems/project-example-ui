import { PasswordField, PasswordFieldAction } from "../../../field/password/action"

import { PasswordFieldComponentState } from "./data"

import { Password } from "../../../password/data"
import { Content } from "../../../input/data"

export interface PasswordFieldComponentAction {
    passwordField: PasswordFieldAction
}

export interface PasswordFieldComponent {
    onContentChange(contentChanged: Publisher<Content<Password>>): void
    init(stateChanged: Publisher<PasswordFieldComponentState>): void
    terminate(): void

    field: PasswordField
}

interface Publisher<T> {
    (state: T): void
}
