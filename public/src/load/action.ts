import { CredentialAction } from "./credential/action";
import { RenewAction } from "./renew/action";
import { ScriptAction } from "./script/action";

export type LoadAction = {
    credential: CredentialAction,
    renew: RenewAction,
    script: ScriptAction,
}
