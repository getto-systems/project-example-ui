import { LoginIDFieldResource } from "../../../../login_id/field/action"

import { LoginIDFieldError } from "../../../../login_id/field/data"
import { InputValue, Valid, noError } from "../../../../field/data"

export interface LoginIDFieldInit {
    (actions: LoginIDFieldActionSet): LoginIDFieldComponent
}
export type LoginIDFieldActionSet = Readonly<{
    loginID: LoginIDFieldResource
}>

export interface LoginIDFieldComponent {
    onStateChange(post: Post<LoginIDFieldState>): void
    action(request: LoginIDFieldRequest): void
}

export type LoginIDFieldState =
    Readonly<{ type: "succeed-to-update-login_id", result: Valid<LoginIDFieldError> }>

export const initialLoginIDFieldState: LoginIDFieldState = {
    type: "succeed-to-update-login_id",
    result: noError(),
}

export type LoginIDFieldRequest =
    Readonly<{ type: "set", inputValue: InputValue }>

interface Post<T> {
    (state: T): void
}
