import { VNode } from "preact";
import { useState, useEffect } from "preact/hooks";

import { appendScript, view } from "./load_script/view";

import { LoadScriptState, LoadScriptComponent } from "../../load/load_script";

import { ScriptState } from "../../ability/script/data";

interface PreactLoginScriptComponent {
    (): VNode
}

export function LoadScript(component: LoadScriptComponent, initialState: LoadScriptState): PreactLoginScriptComponent {
    const [initialScriptState] = initialState;

    return (): VNode => {
        const [scriptState, setScriptState] = useState(initialScriptState);
        component.handleEvent({
            onScriptStateChanged: (promise: Promise<ScriptState>) => {
                promise.then(setScriptState);
            },
        });

        useEffect(() => {
            appendScript(scriptState);
        }, [scriptState]);

        return view(scriptState);
    }
}
