import { LoginIDFieldComponentState } from "../field/login_id/data"
import { PasswordFieldComponentState } from "../field/password/data"

import { AuthCredential } from "../../credential/data"
import { LoginError } from "../../password_login/data"
import { LoginIDFieldOperation } from "../../field/login_id/data"
import { PasswordFieldOperation } from "../../field/password/data"

export type PasswordLoginComponentState =
    Readonly<{ type: "initial-login" }> |
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "delayed-to-login" }> |
    Readonly<{ type: "failed-to-login", err: LoginError }> |
    Readonly<{ type: "succeed-to-login", authCredential: AuthCredential }>

export const initialPasswordLoginComponentState: PasswordLoginComponentState = { type: "initial-login" }

export type PasswordLoginComponentOperation =
    Readonly<{ type: "login" }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }> |
    Readonly<{ type: "field-password", operation: PasswordFieldOperation }>

export type PasswordLoginWorkerComponentState =
    Readonly<{ type: "password_login", state: PasswordLoginComponentState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldComponentState }> |
    Readonly<{ type: "field-password", state: PasswordFieldComponentState }>
