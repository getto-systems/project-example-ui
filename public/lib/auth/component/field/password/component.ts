import { PasswordFieldResource } from "../../../../password/field/action"

import {
    PasswordFieldError,
    PasswordCharacter, simplePassword,
    PasswordView, hidePassword,
} from "../../../../password/field/data"
import { InputValue, Valid, noError } from "../../../../field/data"

export interface PasswordFieldInit {
    (actions: PasswordFieldActionSet): PasswordFieldComponent
}
export type PasswordFieldActionSet = Readonly<{
    password: PasswordFieldResource
}>

export interface PasswordFieldComponent {
    onStateChange(post: Post<PasswordFieldState>): void
    action(request: PasswordFieldRequest): void
}

export type PasswordFieldState = Readonly<{
    type: "succeed-to-update-password",
    result: Valid<PasswordFieldError>,
    character: PasswordCharacter,
    view: PasswordView,
}>

export const initialPasswordFieldState: PasswordFieldState = {
    type: "succeed-to-update-password",
    result: noError(),
    character: simplePassword,
    view: hidePassword,
}

export type PasswordFieldRequest =
    Readonly<{ type: "set", inputValue: InputValue }> |
    Readonly<{ type: "show" }> |
    Readonly<{ type: "hide" }>

interface Post<T> {
    (state: T): void
}
