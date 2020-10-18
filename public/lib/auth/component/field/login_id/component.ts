import { LoginIDFieldAction } from "../../../../login_id/field/action"

import { LoginID } from "../../../../login_id/data"
import { LoginIDFieldError } from "../../../../login_id/field/data"
import { InputValue, Content, Valid, noError } from "../../../../field/data"

export interface LoginIDFieldInit {
    (actions: LoginIDFieldActionSet): LoginIDFieldComponent
}
export type LoginIDFieldActionSet = Readonly<{
    loginID: LoginIDFieldAction
}>

export interface LoginIDFieldComponent {
    onStateChange(post: Post<LoginIDFieldState>): void
    action(request: LoginIDFieldRequest): void
    validate(post: Post<LoginIDFieldValidateEvent>): void
}

export type LoginIDFieldState =
    Readonly<{ type: "succeed-to-update", result: Valid<LoginIDFieldError> }>

export const initialLoginIDFieldState: LoginIDFieldState = { type: "succeed-to-update", result: noError() }

export type LoginIDFieldRequest =
    Readonly<{ type: "set", inputValue: InputValue }>

export type LoginIDFieldValidateEvent =
    Readonly<{ type: "succeed-to-validate", content: Content<LoginID> }>

interface Post<T> {
    (state: T): void
}
