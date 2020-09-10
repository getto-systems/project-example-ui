import { AuthCredentialAction } from "../ability/auth_credential/action";
import { ScriptAction } from "../ability/script/action";
import { PasswordLoginAction } from "../ability/password_login/action";
import { PasswordAction } from "../ability/password/action";
//import { PasswordResetAction } from "../ability/password_reset/action";

export type AuthAction = {
    authCredential: AuthCredentialAction,
    script: ScriptAction,
    password: PasswordAction,

    passwordLogin: PasswordLoginAction,
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
