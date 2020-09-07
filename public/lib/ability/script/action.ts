import { LoadState, LoadStateEventHandler } from "./data";

export interface ScriptAction {
    initScriptApi(): ScriptApi
}

export interface ScriptApi {
    currentState(): LoadState
    load(handler: LoadStateEventHandler): void
}
