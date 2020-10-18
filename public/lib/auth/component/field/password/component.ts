import { PasswordFieldAction } from "../../../../password/field/action"

import { Password } from "../../../../password/data"
import {
    PasswordFieldError,
    PasswordCharacter, simplePassword,
    PasswordView, hidePassword,
} from "../../../../password/field/data"
import { InputValue, Content, Valid, noError } from "../../../../field/data"

export interface PasswordFieldInit {
    (actions: PasswordFieldActionSet): PasswordFieldComponent
}
export type PasswordFieldActionSet = Readonly<{
    password: PasswordFieldAction
}>

export interface PasswordFieldComponent {
    onStateChange(post: Post<PasswordFieldState>): void
    action(request: PasswordFieldRequest): void
    validate(post: Post<PasswordFieldValidateEvent>): void
}

export type PasswordFieldState = Readonly<{
    type: "succeed-to-update",
    result: Valid<PasswordFieldError>,
    character: PasswordCharacter,
    view: PasswordView,
}>

export const initialPasswordFieldState: PasswordFieldState = {
    type: "succeed-to-update",
    result: noError(),
    character: simplePassword,
    view: hidePassword,
}

export type PasswordFieldRequest =
    Readonly<{ type: "set", inputValue: InputValue }> |
    Readonly<{ type: "show" }> |
    Readonly<{ type: "hide" }>

export type PasswordFieldValidateEvent =
    Readonly<{ type: "succeed-to-validate", content: Content<Password> }>

interface Post<T> {
    (state: T): void
}
