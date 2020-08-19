import { AuthAction } from "./auth/action";
import { ScriptAction } from "./script/action";

export type LoadAction = {
    auth: AuthAction,
    script: ScriptAction,
}
