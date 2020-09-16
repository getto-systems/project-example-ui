import { PasswordLoginAction } from "../../password_login/action"

import { LoginIDFieldComponent } from "../field/login_id/data"
import { PasswordFieldComponent } from "../field/password/data"

import { AuthCredential } from "../../credential/data"
import { InputContent, LoginEvent, LoginError } from "../../password_login/data"

export interface PasswordLoginComponentAction {
    passwordLogin: PasswordLoginAction
}

export interface PasswordLoginComponent {
    hook(stateChanged: Publisher<LoginEvent>): void
    init(stateChanged: Publisher<PasswordLoginComponentState>): void
    terminate(): void
    trigger(operation: PasswordLoginComponentOperation): Promise<void>

    field: PasswordLoginComponentField
}

export type PasswordLoginComponentField = Readonly<{
    loginID: LoginIDFieldComponent
    password: PasswordFieldComponent
}>

export type PasswordLoginComponentState =
    Readonly<{ type: "initial-login" }> |
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "delayed-to-login" }> |
    Readonly<{ type: "failed-to-login", content: InputContent, err: LoginError }> |
    Readonly<{ type: "succeed-to-login", authCredential: AuthCredential }>

export const initialPasswordLoginComponentState: PasswordLoginComponentState = { type: "initial-login" }

export type PasswordLoginComponentOperation =
    Readonly<{ type: "login" }>

interface Publisher<T> {
    (state: T): void
}
