import { LoginIDFieldAction, LoginIDFieldEvent } from "../../../field/login_id/action"

import { LoginID } from "../../../credential/data"
import { LoginIDFieldError } from "../../../field/login_id/data"
import { InputValue, Content, Valid } from "../../../input/data"

export interface LoginIDFieldComponentAction {
    loginIDField: LoginIDFieldAction
}

export interface LoginIDFieldComponent {
    initialState: LoginIDFieldComponentState

    onChange(changed: LoginIDContentHandler): void

    set(event: LoginIDFieldComponentEvent, loginID: InputValue): Promise<void>
    validate(event: LoginIDFieldComponentEvent): Promise<void>
}

export type LoginIDFieldComponentState =
    Readonly<{ type: "input-login-id", result: Valid<LoginIDFieldError> }>

export interface LoginIDFieldComponentEvent extends LoginIDFieldEvent { } // eslint-disable-line @typescript-eslint/no-empty-interface

export interface LoginIDFieldComponentEventInit {
    (stateChanged: LoginIDFieldComponentStateHandler): LoginIDFieldComponentEvent
}

export interface LoginIDFieldComponentStateHandler {
    (state: LoginIDFieldComponentState): void
}

export interface LoginIDContentHandler {
    (content: Content<LoginID>): void
}
