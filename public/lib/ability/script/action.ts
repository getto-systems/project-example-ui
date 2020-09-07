import { ScriptState, ScriptStateEventHandler } from "./data";

export interface ScriptAction {
    initScriptApi(): ScriptApi
}

export interface ScriptApi {
    currentState(): ScriptState
    load(handler: ScriptStateEventHandler): void
}
