import { ScriptState, ScriptEventHandler } from "./data";

export interface ScriptAction {
    initScriptApi(): ScriptApi
}

export interface ScriptApi {
    currentState(): ScriptState
    load(handler: ScriptEventHandler): void
}
