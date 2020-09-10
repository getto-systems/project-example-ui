import { Infra } from "./infra";

import { Pathname, ScriptPath } from "./data";
import { ScriptAction, ScriptEvent } from "./action";

export function initScriptAction(infra: Infra): ScriptAction {
    return new ScriptActionImpl(infra);
}

class ScriptActionImpl implements ScriptAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra;
    }

    async load(event: ScriptEvent): Promise<void> {
        const result = this.infra.location.pathname();
        if (!result.success) {
            event.failedToLoad(result.err);
            return;
        }

        event.succeedToLoad(secureScriptPath(this.infra.env.secureServerHost, result.pathname));
        return;

        function secureScriptPath(secureHost: string, pathname: Pathname): ScriptPath {
            // secure host に html と同じパスで js がホストされている
            return { scriptPath: `//${secureHost}${pathname.pathname.replace(/\.html$/, ".js")}` };
        }
    }
}
