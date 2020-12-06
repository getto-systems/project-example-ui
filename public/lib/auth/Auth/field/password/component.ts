import { PasswordFieldAction } from "../../../common/field/password/action"

import {
    PasswordFieldError,
    PasswordFieldEvent,
    PasswordCharacter,
    simplePassword,
    PasswordView,
    hidePassword,
} from "../../../common/field/password/data"
import { InputValue, Valid, noError } from "../../../common/field/data"

export interface PasswordFieldComponentFactory {
    (material: PasswordFieldMaterial): PasswordFieldComponent
}
export type PasswordFieldMaterial = Readonly<{
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