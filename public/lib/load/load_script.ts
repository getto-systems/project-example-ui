import { LoadAction } from "./action";
import { LoadedScript } from "./script/data";

export type LoadScriptInit = [LoadScriptState, LoadScriptComponent];

export type LoadScriptState =
    Readonly<{ state: "initial", promise: Promise<LoadScriptState> }> |
    Readonly<{ state: "loaded", script: LoadedScript }>;
function loadScriptInitial(promise: Promise<LoadScriptState>): LoadScriptState {
    return { state: "initial", promise }
}
function loadScriptLoaded(script: LoadedScript): LoadScriptState {
    return { state: "loaded", script }
}

export interface LoadScriptComponent {
    nextState(state: LoadScriptState): LoadScriptNextState
}

export type LoadScriptNextState =
    Readonly<{ hasNext: false }> |
    Readonly<{ hasNext: true, promise: Promise<LoadScriptState> }>
const loadScriptStatic: LoadScriptNextState = { hasNext: false }
function loadScriptNextState(promise: Promise<LoadScriptState>): LoadScriptNextState {
    return { hasNext: true, promise }
}

export function initLoadScript(action: LoadAction): LoadScriptInit {
    const component = {
        nextState,
    }

    return [loadScriptInitial(loadScript()), component];

    function nextState(state: LoadScriptState): LoadScriptNextState {
        switch (state.state) {
            case "initial":
                return loadScriptNextState(state.promise);

            case "loaded":
                return loadScriptStatic;

            default:
                return assertNever(state);
        }
    }

    async function loadScript(): Promise<LoadScriptState> {
        return loadScriptLoaded(await action.script.load());
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
