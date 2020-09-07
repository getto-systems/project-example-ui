import { Infra, ScriptEnv, PathnameLocation } from "./infra";

import {
    Pathname,
    ScriptPath,
    ScriptState, initialScript, tryToLoadScript, failedToLoadScript, succeedToLoadScript,
    ScriptEventHandler,
} from "./data";
import { ScriptAction, ScriptApi } from "./action";

export function initScriptAction(infra: Infra): ScriptAction {
    return new ScriptActionImpl(infra);
}

class ScriptActionImpl implements ScriptAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra;
    }

    initScriptApi(): ScriptApi {
        return new ScriptApiImpl(this.infra.env, this.infra.location);
    }
}

class ScriptApiImpl implements ScriptApi {
    scriptEnv: ScriptEnv
    pathnameLocation: PathnameLocation

    state: ScriptState

    constructor(scriptEnv: ScriptEnv, pathnameLocation: PathnameLocation) {
        this.scriptEnv = scriptEnv;
        this.pathnameLocation = pathnameLocation;

        this.state = initialScript;
    }

    currentState(): ScriptState {
        return this.state;
    }

    load(handler: ScriptEventHandler): void {
        if (this.state.state === "initial-script") {
            this.updateState(handler, tryToLoadScript);
        }
    }

    updateState(handler: ScriptEventHandler, state: ScriptState): void {
        this.state = state;
        handler(this.state);

        if (state.state === "try-to-load-script") {
            this.loadScript().then((state) => {
                this.updateState(handler, state);
            });
        }
    }

    async loadScript(): Promise<ScriptState> {
        const pathname = await this.pathnameLocation.pathname();
        if (pathname.found) {
            return succeedToLoadScript(secureScriptPath(this.scriptEnv.secureServerHost, pathname.pathname));
        } else {
            return failedToLoadScript({ type: "infra-error", err: pathname.err });
        }
    }
}

function secureScriptPath(secureHost: string, pathname: Pathname): ScriptPath {
    // secure host に html と同じパスで js がホストされている
    return { scriptPath: `//${secureHost}${pathname.pathname.replace(/\.html$/, ".js")}` };
}
