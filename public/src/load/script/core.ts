import { ScriptAction } from "./action";
import { ScriptPath } from "./data";
import { Infra } from "./infra";

export function scriptAction(infra: Infra): ScriptAction {
    return {
        async getPath(): Promise<ScriptPath> {
            const path = await infra.location.pathname();
            return `//${infra.env.secureServerHost}${path.replace(/\.html$/, ".js")}`;
        },
    };
}
