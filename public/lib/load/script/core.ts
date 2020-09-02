import { ScriptAction } from "./action";
import { Pathname, ScriptPath, scriptPath, LoadedScript, loaded, loadError } from "./data";
import { Infra } from "./infra";

export function scriptAction(infra: Infra): ScriptAction {
    return {
        load,
    }

    async function load(): Promise<LoadedScript> {
        try {
            return loaded(secureScriptPath(
                infra.env.secureServerHost,
                await infra.location.pathname(),
            ));
        } catch (err) {
            return loadError({ type: "infra-error", err });
        }
    }
}

function secureScriptPath(secureHost: string, pathname: Pathname): ScriptPath {
    // secure host に html と同じパスで js がホストされている
    return scriptPath(`//${secureHost}${pathname.pathname.replace(/\.html$/, ".js")}`);
}
