import { CredentialAction, LoginIDEvent } from "../../../credential/action"

import { LoginID, LoginIDError } from "../../../credential/data"
import { InputValue, Content, Valid } from "../../../input/data"

export interface LoginIDFieldComponentAction {
    credential: CredentialAction
}

export interface LoginIDFieldComponent {
    initialState: LoginIDFieldComponentState
    onStateChange(stateChanged: LoginIDFieldComponentStateHandler): void

    validate(): Promise<Content<LoginID>>
    setLoginID(loginID: InputValue): Promise<void>
}

export interface LoginIDFieldComponentEvent extends LoginIDEvent { }

export type LoginIDFieldComponentState =
    Readonly<{ type: "input-login-id", result: Valid<LoginIDError> }>

export interface LoginIDFieldComponentStateHandler {
    (state: LoginIDFieldComponentState): void
}
