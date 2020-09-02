import { LoadAction } from "./action";
import { LoadedScript } from "./script/data";

export type LoadScriptInit = [LoadScriptState];

export type LoadScriptState =
    Readonly<{ state: "initial", next: Promise<LoadScriptState> }> |
    Readonly<{ state: "loaded", script: LoadedScript }>;
function loadScriptInitial(next: Promise<LoadScriptState>): LoadScriptState {
    return { state: "initial", next }
}
function loadScriptLoaded(script: LoadedScript): LoadScriptState {
    return { state: "loaded", script }
}

export function initLoadScript(action: LoadAction): LoadScriptInit {
    return [loadScriptInitial(loadScript())];

    async function loadScript(): Promise<LoadScriptState> {
        return loadScriptLoaded(await action.script.load());
    }
}
