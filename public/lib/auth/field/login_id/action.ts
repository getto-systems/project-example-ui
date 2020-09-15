import { LoginIDFieldAction, LoginIDFieldEventHandler, LoginIDFieldEventPublisher } from "../../../field/login_id/action"

import { LoginID } from "../../../credential/data"
import { LoginIDFieldError } from "../../../field/login_id/data"
import { InputValue, Content, Valid } from "../../../input/data"

export interface LoginIDFieldComponentAction {
    loginIDField: LoginIDFieldAction
}

/*
export interface LoginIDFieldComponent {
    onContentChanged(contentChanged: LoginIDContentHandler): void
    init(stateChanged: LoginIDFieldComponentStateHandler): void

    set(loginID: InputValue): Promise<void>
    validate(): Promise<void>
}
 */

export interface LoginIDFieldComponentDeprecated {
    initialState: LoginIDFieldComponentState

    onChange(changed: LoginIDContentHandler): void

    set(event: LoginIDFieldComponentEvent, loginID: InputValue): Promise<void>
    validate(event: LoginIDFieldComponentEvent): Promise<void>
}

export type LoginIDFieldComponentState =
    Readonly<{ type: "input-login-id", result: Valid<LoginIDFieldError> }>

export interface LoginIDFieldComponentEventHandler extends LoginIDFieldEventHandler { } // eslint-disable-line @typescript-eslint/no-empty-interface

export interface LoginIDFieldComponentEvent extends LoginIDFieldEventPublisher { } // eslint-disable-line @typescript-eslint/no-empty-interface

export interface LoginIDFieldComponentEventInit {
    (stateChanged: LoginIDFieldComponentStateHandler): LoginIDFieldComponentEvent
}

export interface LoginIDFieldComponentStateHandler {
    (state: LoginIDFieldComponentState): void
}

export interface LoginIDContentHandler {
    (content: Content<LoginID>): void
}
