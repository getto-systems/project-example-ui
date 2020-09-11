import { CredentialAction } from "../credential/action"
import { ScriptAction } from "../script/action"
import { PasswordAction } from "../password/action"
import { PasswordLoginAction } from "../password_login/action"
import { PasswordResetSessionAction } from "../password_reset_session/action"
import { PasswordResetAction } from "../password_reset/action"

import { RenewError } from "../credential/data"
import { CheckError } from "../script/data"

export type AuthAction = {
    credential: CredentialAction,
    script: ScriptAction,
    password: PasswordAction,

    passwordLogin: PasswordLoginAction,
    passwordResetSession: PasswordResetSessionAction,
    passwordReset: PasswordResetAction,
}

export interface AuthEvent {
    tryToLogin(): void
    failedToAuth(err: AuthError): void
    succeedToAuth(): void
}

export type AuthError =
    Readonly<{ type: "renew", err: RenewError }> |
    Readonly<{ type: "check", err: CheckError }>
