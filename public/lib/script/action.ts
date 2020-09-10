import { ScriptPath, ScriptError, ScriptState, ScriptEventHandler } from "./data";

export interface ScriptAction {
    load_withEvent(event: ScriptEvent): Promise<void>

    initialScriptState(): ScriptState
    initScriptApi(): ScriptApi
}

export interface ScriptEvent {
    tryToLoad(): void
    failedToLoad(err: ScriptError): void
    succeedToLoad(scriptPath: ScriptPath): void
}

export interface ScriptApi {
    load(handler: ScriptEventHandler): void
}
