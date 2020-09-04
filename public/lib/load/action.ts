import { CredentialAction } from "../wand/credential/action";
import { PasswordAction } from "../wand/password/action";
import { PasswordLoginAction } from "../wand/password_login/action";
import { PasswordResetAction } from "../wand/password_reset/action";
import { ScriptAction } from "../wand/script/action";

export type LoadAction = {
    credential: CredentialAction,
    password: PasswordAction,
    passwordLogin: PasswordLoginAction,
    passwordReset: PasswordResetAction,
    script: ScriptAction,
}
