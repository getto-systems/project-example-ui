import { ScriptAction } from "./action";
import {
    Pathname,
    ScriptPath,
    LoadState, tryToLoad, failedToLoad, succeedToLoad,
} from "./data";
import { Infra } from "./infra";

export function scriptAction(infra: Infra): ScriptAction {
    return {
        load,
    }

    function load(): LoadState {
        return tryToLoad(loadScript());
    }

    async function loadScript(): Promise<LoadState> {
        const pathname = await infra.location.pathname();
        if (pathname.found) {
            return succeedToLoad(secureScriptPath(infra.env.secureServerHost, pathname.pathname));
        } else {
            return failedToLoad({ type: "infra-error", err: pathname.err });
        }
    }
}

function secureScriptPath(secureHost: string, pathname: Pathname): ScriptPath {
    // secure host に html と同じパスで js がホストされている
    return { path: `//${secureHost}${pathname.pathname.replace(/\.html$/, ".js")}` };
}
