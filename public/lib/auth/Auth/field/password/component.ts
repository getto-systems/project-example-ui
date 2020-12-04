import { PasswordFieldAction } from "../../../common/password/field/action"

import {
    PasswordFieldError,
    PasswordFieldEvent,
    PasswordCharacter,
    simplePassword,
    PasswordView,
    hidePassword,
} from "../../../common/password/field/data"
import { InputValue, Valid, noError } from "../../../common/field/data"

export interface PasswordFieldComponentFactory {
    (actions: PasswordFieldActionSet): PasswordFieldComponent
}
export type PasswordFieldActionSet = Readonly<{
    password: PasswordFieldAction
}>

export interface PasswordFieldComponent {
    onStateChange(post: Post<PasswordFieldState>): void
    set(inputValue: InputValue): void
    show(): void
    hide(): void
    validate(post: Post<PasswordFieldEvent>): void
}

export type PasswordFieldState = Readonly<{
    type: "succeed-to-update"
    result: Valid<PasswordFieldError>
    character: PasswordCharacter
    view: PasswordView
}>

export const initialPasswordFieldState: PasswordFieldState = {
    type: "succeed-to-update",
    result: noError(),
    character: simplePassword,
    view: hidePassword,
}

interface Post<T> {
    (state: T): void
}
