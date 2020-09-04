import { LoadAction } from "./action";

import { LoadState } from "../wand/script/data";

export type LoadScriptInit = [LoadScriptComponent, LoadScriptState];

export interface LoadScriptComponent {
    nextState(state: LoadScriptState): LoadScriptNextState
}

export type LoadScriptState = LoadState

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

    return [component, action.script.load()]

    function nextState(state: LoadScriptState): LoadScriptNextState {
        switch (state.state) {
            case "try-to-load":
                return loadScriptNextState(state.promise);

            case "failed-to-load":
            case "succeed-to-load":
                return loadScriptStatic;
        }
    }
}
