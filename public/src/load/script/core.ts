import { ScriptAction, ScriptPath } from "./data";
import { Infra } from "./infra";

export function scriptAction(infra: Infra): ScriptAction {
    return {
        getPath(): ScriptPath {
            const path = infra.location.pathname();
            return `//${infra.env.secureServer}${path.replace(/\.html$/, ".js")}`;
        },
    };
}
