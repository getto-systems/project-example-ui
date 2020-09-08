import { LoadAction } from "./action";

import { ScriptState, ScriptEventHandler } from "../ability/script/data";
import { ScriptApi } from "../ability/script/action";

export type LoadScriptInit = [LoadScriptComponent, LoadScriptState]
export type ScriptInit = [ScriptComponent, ScriptState]

export interface LoadScriptComponent {
    handleEvent(event: LoadScriptEvent): void

    initScript(): ScriptInit
}
export type LoadScriptEvent = {
    onLoadScriptStateChanged: LoadScriptEventHandler,
}
export interface LoadScriptEventHandler {
    (promise: Promise<LoadScriptState>): void
}

export interface ScriptComponent {
    handleEvent(event: ScriptEvent): void
}
export type ScriptEvent = {
    onScriptStateChanged: ScriptEventHandler,
}

export type LoadScriptState =
    Readonly<{ type: "load-script" }>
const Script: LoadScriptState = { type: "load-script" }

export function initLoadScript(action: LoadAction): LoadScriptInit {
    const component = new LoadScriptComponentImpl(action);
    return [component, component.state]
}

class LoadScriptComponentImpl implements LoadScriptComponent {
    action: LoadAction

    state: LoadScriptState

    //event: EventNotifier<LoadScriptEventNotifier>

    constructor(action: LoadAction) {
        this.action = action;
        //this.event = emptyEventNotifier;

        this.state = Script;
    }

    handleEvent(_event: LoadScriptEvent): void {
        //this.event = eventNotifier(new LoadScriptEventNotifier(event));
    }

    initScript(): ScriptInit {
        return [new ScriptComponentImpl(this.action.script.initScriptApi()), this.action.script.initialScriptState()]
    }
}

class ScriptComponentImpl implements ScriptComponent {
    api: ScriptApi

    constructor(api: ScriptApi) {
        this.api = api;
    }

    handleEvent(event: ScriptEvent): void {
        this.api.load(event.onScriptStateChanged);
    }
}
