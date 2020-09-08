import { ScriptState, ScriptEventHandler } from "./data";

export interface ScriptAction {
    initialScriptState(): ScriptState
    initScriptApi(): ScriptApi
}

export interface ScriptApi {
    load(handler: ScriptEventHandler): void
}
