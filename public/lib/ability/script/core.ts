import { Infra } from "./infra";

import {
    Pathname,
    ScriptPath,
    LoadState, tryToLoad, failedToLoad, succeedToLoad,
} from "./data";
import { ScriptAction } from "./action";

export function initScriptAction(infra: Infra): ScriptAction {
    return new ScriptActionImpl(infra);
}

class ScriptActionImpl implements ScriptAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra;
    }

    load(): LoadState {
        return tryToLoad(this.loadScript());
    }

    async loadScript(): Promise<LoadState> {
        const pathname = await this.infra.location.pathname();
        if (pathname.found) {
            return succeedToLoad(secureScriptPath(this.infra.env.secureServerHost, pathname.pathname));
        } else {
            return failedToLoad({ type: "infra-error", err: pathname.err });
        }
    }
}

function secureScriptPath(secureHost: string, pathname: Pathname): ScriptPath {
    // secure host に html と同じパスで js がホストされている
    return { path: `//${secureHost}${pathname.pathname.replace(/\.html$/, ".js")}` };
}
