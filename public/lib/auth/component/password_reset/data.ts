import { LoginIDFieldState } from "../field/login_id"
import { PasswordFieldState } from "../field/password"

import { AuthCredential } from "../../../credential/data"
import { ResetToken, ResetError } from "../../../password_reset/data"
import { LoginIDFieldOperation } from "../../../field/login_id/data"
import { PasswordFieldOperation } from "../../../field/password/data"

export type PasswordResetState =
    Readonly<{ type: "initial-reset" }> |
    Readonly<{ type: "try-to-reset" }> |
    Readonly<{ type: "delayed-to-reset" }> |
    Readonly<{ type: "failed-to-reset", err: ResetError }> |
    Readonly<{ type: "succeed-to-reset", authCredential: AuthCredential }>

export const initialPasswordResetState: PasswordResetState = { type: "initial-reset" }

export type PasswordResetComponentOperation =
    Readonly<{ type: "reset", resetToken: ResetToken }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }> |
    Readonly<{ type: "field-password", operation: PasswordFieldOperation }>

export type PasswordResetWorkerState =
    Readonly<{ type: "password_reset", state: PasswordResetState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldState }> |
    Readonly<{ type: "field-password", state: PasswordFieldState }>
