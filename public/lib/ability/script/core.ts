import { Infra, ScriptEnv, PathnameLocation } from "./infra";

import {
    Pathname,
    ScriptPath,
    LoadState, initialLoad, tryToLoad, failedToLoad, succeedToLoad,
    LoadStateEventHandler,
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

    state: LoadState

    constructor(scriptEnv: ScriptEnv, pathnameLocation: PathnameLocation) {
        this.scriptEnv = scriptEnv;
        this.pathnameLocation = pathnameLocation;

        this.state = initialLoad;
    }

    currentState(): LoadState {
        return this.state;
    }

    stateChanged(handler: LoadStateEventHandler, promise: Promise<LoadState>): void {
        handler(this.updateState(promise));
    }
    async updateState(promise: Promise<LoadState>): Promise<LoadState> {
        this.state = await promise;
        return this.state;
    }

    load(handler: LoadStateEventHandler): void {
        switch (this.state.state) {
            case "initial-load":
                this.state = tryToLoad;
                this.stateChanged(handler, this.loadScript());
                return;

            case "try-to-load":
            case "failed-to-load":
            case "succeed-to-load":
                return;

            default:
                return assertNever(this.state);
        }
    }

    async loadScript(): Promise<LoadState> {
        const pathname = await this.pathnameLocation.pathname();
        if (pathname.found) {
            return succeedToLoad(secureScriptPath(this.scriptEnv.secureServerHost, pathname.pathname));
        } else {
            return failedToLoad({ type: "infra-error", err: pathname.err });
        }
    }
}

function secureScriptPath(secureHost: string, pathname: Pathname): ScriptPath {
    // secure host に html と同じパスで js がホストされている
    return { path: `//${secureHost}${pathname.pathname.replace(/\.html$/, ".js")}` };
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
