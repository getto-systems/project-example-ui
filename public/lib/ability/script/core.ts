import { Infra, ScriptEnv, PathnameLocation } from "./infra";

import {
    Pathname,
    ScriptPath,
    ScriptState, initialScript, tryToLoadScript, failedToLoadScript, succeedToLoadScript,
    ScriptStateEventHandler,
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

    stateChanged(handler: ScriptStateEventHandler, promise: Promise<ScriptState>): void {
        handler(this.updateState(promise));
    }
    async updateState(promise: Promise<ScriptState>): Promise<ScriptState> {
        this.state = await promise;
        return this.state;
    }

    load(handler: ScriptStateEventHandler): void {
        switch (this.state.state) {
            case "initial-script":
                this.state = tryToLoadScript;
                this.stateChanged(handler, this.loadScript());
                return;

            case "try-to-load-script":
            case "failed-to-load-script":
            case "succeed-to-load-script":
                return;

            default:
                return assertNever(this.state);
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

function assertNever(_: never): never {
    throw new Error("NEVER");
}
