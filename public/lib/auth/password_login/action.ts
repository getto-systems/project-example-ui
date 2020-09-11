import { LoginIDFieldComponent } from "../field/login_id/action"
import { PasswordFieldComponent } from "../field/password/action"

import { CredentialAction, StoreEvent } from "../../credential/action"
import { PasswordLoginAction, LoginEvent } from "../../password_login/action"

import { StoreError } from "../../credential/data"
import { InputContent, LoginError } from "../../password_login/data"

export interface PasswordLoginComponentAction {
    credential: CredentialAction
    passwordLogin: PasswordLoginAction
}

export interface PasswordLoginComponent {
    loginID: LoginIDFieldComponent
    password: PasswordFieldComponent

    initialState: PasswordLoginComponentState

    onStateChange(stateChanged: PasswordLoginComponentStateHandler): void

    login(): Promise<void>
}

export interface PasswordLoginComponentEvent extends LoginEvent, StoreEvent { }

export type PasswordLoginComponentState =
    Readonly<{ type: "initial-login" }> |
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "delayed-to-login" }> |
    Readonly<{ type: "failed-to-login", content: InputContent, err: LoginError }> |
    Readonly<{ type: "failed-to-store", err: StoreError }>

export interface PasswordLoginComponentStateHandler {
    (state: PasswordLoginComponentState): void
}
