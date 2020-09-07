export type Pathname = Readonly<{ pathname: Readonly<string> }>;
export type ScriptPath = Readonly<{ scriptPath: Readonly<string> }>;

export type ScriptState =
    Readonly<{ state: "initial-script" }> |
    Readonly<{ state: "try-to-load-script" }> |
    Readonly<{ state: "failed-to-load-script", err: ScriptError }> |
    Readonly<{ state: "succeed-to-load-script", scriptPath: ScriptPath }>;
export const initialScript: ScriptState = { state: "initial-script" }
export const tryToLoadScript: ScriptState = { state: "try-to-load-script" }
export function failedToLoadScript(err: ScriptError): ScriptState {
    return { state: "failed-to-load-script", err }
}
export function succeedToLoadScript(scriptPath: ScriptPath): ScriptState {
    return { state: "succeed-to-load-script", scriptPath }
}

export interface ScriptEventHandler {
    (state: ScriptState): void
}

export type ScriptError =
    Readonly<{ type: "infra-error", err: string }>
