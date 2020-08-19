import { LoadAction } from "./action";
import { ScriptPath } from "./script/data";

type LoadScriptState =
    { scriptPath: ScriptPath }

function state(scriptPath: ScriptPath): LoadScriptState {
    return { scriptPath: scriptPath }
}

export interface LoadScriptComponent {
    initial: LoadScriptState,
}

export function initLoadScriptComponent(action: LoadAction): LoadScriptComponent {
    return {
        initial: state(action.script.getPath()),
    }
}
