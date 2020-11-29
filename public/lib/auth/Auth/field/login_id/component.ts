import { LoginIDFieldAction } from "../../../login_id/field/action"

import { LoginIDFieldError, LoginIDFieldEvent } from "../../../login_id/field/data"
import { InputValue, Valid, noError } from "../../../field/data"

export interface LoginIDFieldComponentFactory {
    (actions: LoginIDFieldActionSet): LoginIDFieldComponent
}
export type LoginIDFieldActionSet = Readonly<{
    loginID: LoginIDFieldAction
}>

export interface LoginIDFieldComponent {
    onStateChange(post: Post<LoginIDFieldState>): void
    set(inputValue: InputValue): void
    validate(post: Post<LoginIDFieldEvent>): void
}

export type LoginIDFieldState = Readonly<{ type: "succeed-to-update"; result: Valid<LoginIDFieldError> }>

export const initialLoginIDFieldState: LoginIDFieldState = {
    type: "succeed-to-update",
    result: noError(),
}

interface Post<T> {
    (state: T): void
}
