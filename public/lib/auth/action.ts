import { AuthCredentialAction } from "../credential/action"
import { ScriptAction } from "../script/action"
import { PasswordAction } from "../password/action"
import { PasswordLoginAction } from "../password_login/action"
import { PasswordResetSessionAction } from "../password_reset_session/action"
import { PasswordResetAction } from "../password_reset/action"

export type AuthAction = {
    authCredential: AuthCredentialAction,
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
    Readonly<{ type: "bad-request" }> |
    Readonly<{ type: "server-error" }> |
    Readonly<{ type: "script-not-found" }> |
    Readonly<{ type: "bad-response", err: string }> |
    Readonly<{ type: "infra-error", err: string }>
