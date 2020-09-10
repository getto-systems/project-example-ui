import { AuthCredentialAction } from "../ability/auth_credential/action";
import { ScriptAction } from "../ability/script/action";
import { PasswordAction } from "../ability/password/action";
import { PasswordLoginAction } from "../ability/password_login/action";
import { PasswordResetSessionAction } from "../ability/password_reset_session/action";
//import { PasswordResetAction } from "../ability/password_reset/action";

export type AuthAction = {
    authCredential: AuthCredentialAction,
    script: ScriptAction,
    password: PasswordAction,

    passwordLogin: PasswordLoginAction,
    passwordResetSession: PasswordResetSessionAction,
    /*
    passwordReset: PasswordResetAction,
     */
}

export interface AuthEvent {
    tryToLogin(): void
    failedToAuth(err: AuthError): void
    succeedToAuth(): void
}

export type AuthError = Readonly<{ type: string, err: string }>
