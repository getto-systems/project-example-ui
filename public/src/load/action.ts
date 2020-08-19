import { AuthAction } from "./auth/data";
import { ScriptAction } from "./script/data";

export type LoadAction = {
    auth: AuthAction,
    script: ScriptAction,
}
