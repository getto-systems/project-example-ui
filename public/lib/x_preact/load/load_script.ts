import { h, VNode } from "preact";
import { useState, useEffect } from "preact/hooks";

import { appendScript, view } from "./load_script/view";

import { LoadScriptState, LoadScriptComponent, ScriptComponent } from "../../load/load_script";

import { ScriptState } from "../../ability/script/data";

export interface PreactComponent {
    (): VNode
}

export function LoadScript(component: LoadScriptComponent, initialState: LoadScriptState): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialState);
        component.handleEvent({
            onLoadScriptStateChanged: (promise: Promise<LoadScriptState>) => {
                promise.then(setState);
            },
        });

        switch (state.type) {
            /*
            case "store-credential":
                return StoreCredential(...component.initStoreCredential());
             */

            case "load-script":
                return h(Script(...component.initScript()), {});
        }
    }
}

function Script(component: ScriptComponent, initialState: ScriptState): PreactComponent {
    return (): VNode => {
        const [scriptState, setScriptState] = useState(initialState);
        component.handleEvent({
            onScriptStateChanged: setScriptState,
        });

        useEffect(() => {
            appendScript(scriptState);
        }, [scriptState]);

        return view(scriptState);
    }
}
