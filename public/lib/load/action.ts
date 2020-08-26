import { CredentialAction } from "./credential/action";
import { RenewAction } from "./renew/action";
import { PasswordLoginAction } from "./password_login/action";
import { ScriptAction } from "./script/action";

export type LoadAction = {
    credential: CredentialAction,
    renew: RenewAction,
    passwordLogin: PasswordLoginAction,
    script: ScriptAction,
}

export interface LoadLogined {
    (): void;
}
