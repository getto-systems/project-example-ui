import { CredentialAction } from "./credential/action";
import { PasswordAction } from "./password/action";
import { PasswordLoginAction } from "./password_login/action";
import { PasswordResetAction } from "./password_reset/action";
import { ScriptAction } from "./script/action";

export type LoadAction = {
    credential: CredentialAction,
    password: PasswordAction,
    passwordLogin: PasswordLoginAction,
    passwordReset: PasswordResetAction,
    script: ScriptAction,
}
