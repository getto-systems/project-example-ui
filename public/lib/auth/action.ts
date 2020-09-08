import { AuthCredentialAction } from "../ability/auth_credential/action";
//import { PasswordAction } from "../ability/password/action";
//import { PasswordLoginAction } from "../ability/password_login/action";
//import { PasswordResetAction } from "../ability/password_reset/action";
//import { ScriptAction } from "../ability/script/action";

export type AuthAction = {
    authCredential: AuthCredentialAction,
    /*
    password: PasswordAction,
    passwordLogin: PasswordLoginAction,
    passwordReset: PasswordResetAction,
    script: ScriptAction,
     */
}

export interface AuthEvent {
    tryToLogin(): void
    failedToAuth(err: AuthError): void
    succeedToAuth(): void
}

export type AuthError = Readonly<{ type: string, err: string }>
