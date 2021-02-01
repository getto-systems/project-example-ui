import { LoginIDField } from "../../../common/field/loginID/action"

import { LoginIDFieldError, LoginIDFieldEvent } from "../../../common/field/loginID/data"
import { InputValue, Valid, noError } from "../../../common/field/data"

export interface LoginIDFieldComponentFactory {
    (material: LoginIDFieldMaterial): LoginIDFieldComponent
}
export type LoginIDFieldMaterial = Readonly<{
    loginID: LoginIDField
}>

export interface LoginIDFieldComponent {
    onStateChange(post: Post<LoginIDFieldState>): void
    set(inputValue: InputValue): void
    validate(post: Post<LoginIDFieldEvent>): void
}

// TODO variant が 1つなら type いらない
export type LoginIDFieldState = Readonly<{ type: "succeed-to-update"; result: Valid<LoginIDFieldError> }>

export const initialLoginIDFieldState: LoginIDFieldState = {
    type: "succeed-to-update",
    result: noError(),
}

interface Post<T> {
    (state: T): void
}
