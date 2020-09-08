import { Infra, ScriptEnv, PathnameLocation } from "./infra";

import {
    Pathname,
    ScriptPath,
    ScriptState, initialScript, tryToLoadScript, failedToLoadScript, succeedToLoadScript,
    ScriptEventHandler,
} from "./data";
import { ScriptAction, ScriptEvent, ScriptApi } from "./action";

export function initScriptAction(infra: Infra): ScriptAction {
    return new ScriptActionImpl(infra);
}

class ScriptActionImpl implements ScriptAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra;
    }

    async load_withEvent(event: ScriptEvent): Promise<void> {
        event.tryToLoad();

        const result = await this.infra.location.pathname();
        if (!result.found) {
            event.failedToLoad({ type: "infra-error", err: result.err });
            return;
        }

        event.succeedToLoad(secureScriptPath(this.infra.env.secureServerHost, result.pathname));
        return;

        function secureScriptPath(secureHost: string, pathname: Pathname): ScriptPath {
            // secure host に html と同じパスで js がホストされている
            return { scriptPath: `//${secureHost}${pathname.pathname.replace(/\.html$/, ".js")}` };
        }
    }

    initialScriptState(): ScriptState {
        return initialScript;
    }
    initScriptApi(): ScriptApi {
        return new ScriptApiImpl(this.infra.env, this.infra.location);
    }
}

class ScriptApiImpl implements ScriptApi {
    scriptEnv: ScriptEnv
    pathnameLocation: PathnameLocation

    initial: boolean

    constructor(scriptEnv: ScriptEnv, pathnameLocation: PathnameLocation) {
        this.scriptEnv = scriptEnv;
        this.pathnameLocation = pathnameLocation;

        this.initial = true;
    }

    load(handler: ScriptEventHandler): void {
        if (this.initial) {
            this.initial = false;
            handler(tryToLoadScript);
            this.loadScript(handler);
        }
    }

    async loadScript(handler: ScriptEventHandler): Promise<void> {
        const pathname = await this.pathnameLocation.pathname();
        if (pathname.found) {
            handler(succeedToLoadScript(secureScriptPath(this.scriptEnv.secureServerHost, pathname.pathname)));
            return;
        } else {
            handler(failedToLoadScript({ type: "infra-error", err: pathname.err }));
            return;
        }

        function secureScriptPath(secureHost: string, pathname: Pathname): ScriptPath {
            // secure host に html と同じパスで js がホストされている
            return { scriptPath: `//${secureHost}${pathname.pathname.replace(/\.html$/, ".js")}` };
        }
    }
}
