import { LoadAction } from "./action";

import { ScriptState, ScriptStateEventHandler } from "../ability/script/data";
import { ScriptApi } from "../ability/script/action";

export type LoadScriptInit = [LoadScriptComponent, LoadScriptState]

export interface LoadScriptComponent {
    handleEvent(event: LoadScriptEventHandler): void
}

export type LoadScriptEventHandler = {
    onScriptStateChanged: ScriptStateEventHandler,
}

export type LoadScriptState = [ScriptState]

export function initLoadScript(action: LoadAction): LoadScriptInit {
    const component = new LoadScriptComponentImpl(action.script.initScriptApi());
    return [component, component.currentState()]
}

class LoadScriptComponentImpl implements LoadScriptComponent {
    api: ScriptApi

    constructor(api: ScriptApi) {
        this.api = api;
    }

    currentState(): LoadScriptState {
        return [this.api.currentState()]
    }

    handleEvent(event: LoadScriptEventHandler): void {
        this.api.load(event.onScriptStateChanged);
    }
}
