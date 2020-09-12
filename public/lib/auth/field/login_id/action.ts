import { CredentialAction, LoginIDEvent } from "../../../credential/action"

import { LoginID, LoginIDError } from "../../../credential/data"
import { InputValue, Content, Valid } from "../../../input/data"

export interface LoginIDFieldComponentAction {
    credential: CredentialAction
}

export interface LoginIDFieldComponent {
    initialState: LoginIDFieldComponentState

    onChange(changed: LoginIDContentHandler): void

    set(event: LoginIDFieldComponentEvent, loginID: InputValue): Promise<void>
    validate(event: LoginIDFieldComponentEvent): Promise<void>
}

export type LoginIDFieldComponentState =
    Readonly<{ type: "input-login-id", result: Valid<LoginIDError> }>

export interface LoginIDFieldComponentEvent extends LoginIDEvent { } // eslint-disable-line @typescript-eslint/no-empty-interface

export interface LoginIDFieldComponentEventInit {
    (stateChanged: LoginIDFieldComponentStateHandler): LoginIDFieldComponentEvent
}

export interface LoginIDFieldComponentStateHandler {
    (state: LoginIDFieldComponentState): void
}

export interface LoginIDContentHandler {
    (content: Content<LoginID>): void
}
