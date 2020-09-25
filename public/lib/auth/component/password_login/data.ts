import { LoginIDFieldState } from "../field/login_id"
import { PasswordFieldState } from "../field/password"

import { AuthCredential } from "../../../credential/data"
import { LoginError } from "../../../password_login/data"
import { LoginIDFieldOperation } from "../../../field/login_id/data"
import { PasswordFieldOperation } from "../../../field/password/data"

export type PasswordLoginState =
    Readonly<{ type: "initial-login" }> |
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "delayed-to-login" }> |
    Readonly<{ type: "failed-to-login", err: LoginError }> |
    Readonly<{ type: "succeed-to-login", authCredential: AuthCredential }>

export const initialPasswordLoginState: PasswordLoginState = { type: "initial-login" }

export type PasswordLoginComponentOperation =
    Readonly<{ type: "login" }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }> |
    Readonly<{ type: "field-password", operation: PasswordFieldOperation }>

export type PasswordLoginWorkerState =
    Readonly<{ type: "password_login", state: PasswordLoginState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldState }> |
    Readonly<{ type: "field-password", state: PasswordFieldState }>
