import { CredentialAction } from "../ability/credential/action";
import { PasswordAction } from "../ability/password/action";
import { PasswordLoginAction } from "../ability/password_login/action";
import { PasswordResetAction } from "../ability/password_reset/action";
import { ScriptAction } from "../ability/script/action";

export type LoadAction = {
    credential: CredentialAction,
    password: PasswordAction,
    passwordLogin: PasswordLoginAction,
    passwordReset: PasswordResetAction,
    script: ScriptAction,
}

/* TODO Event を使えば Transition しなくて済む
export interface LoadEvent {
    credentialFetched(credential: AuthCredential): void
}
 */
