import { LoadAction } from "./action";
import { ScriptPath } from "./script/data";

export interface LoadScriptComponent {
    initial: LoadScriptState;
    getScriptPath(): Promise<LoadScriptState>;
}

export type LoadScriptState =
    Readonly<{ state: "initial" }> |
    Readonly<{ state: "loaded", scriptPath: ScriptPath }>;

export type LoadScriptError = Readonly<{
    err: string,
}>
function error(err: string): LoadScriptError {
    return { err: err }
}

function loaded(scriptPath: ScriptPath): LoadScriptState {
    return { state: "loaded", scriptPath: scriptPath }
}

export function initLoadScriptComponent(action: LoadAction): LoadScriptComponent {
    return {
        initial: { state: "initial" },
        async getScriptPath() {
            try {
                return loaded(await action.script.getPath())
            } catch (err) {
                throw error(`${err}`);
            }
        },
    }
}
