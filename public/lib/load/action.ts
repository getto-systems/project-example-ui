import { CredentialAction } from "../action/credential/action";
import { PasswordAction } from "../action/password/action";
import { PasswordLoginAction } from "../action/password_login/action";
import { PasswordResetAction } from "../action/password_reset/action";
import { ScriptAction } from "../action/script/action";

export type LoadAction = {
    credential: CredentialAction,
    password: PasswordAction,
    passwordLogin: PasswordLoginAction,
    passwordReset: PasswordResetAction,
    script: ScriptAction,
}
