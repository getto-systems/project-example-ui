import { VNode } from "preact";
import { useState, useEffect } from "preact/hooks";

import { appendScript, view } from "./load_script/view";

import { LoadScriptState, LoadScriptComponent } from "../../load/load_script";

import { LoadState } from "../../ability/script/data";

interface PreactLoginScriptComponent {
    (): VNode
}

export function LoadScript(component: LoadScriptComponent, initialState: LoadScriptState): PreactLoginScriptComponent {
    const [initialLoadState] = initialState;

    return (): VNode => {
        const [loadState, setLoadState] = useState(initialLoadState);
        component.handleEvent({
            onLoadStateChanged: (promise: Promise<LoadState>) => {
                promise.then(setLoadState);
            },
        });

        useEffect(() => {
            appendScript(loadState);
        }, [loadState]);

        return view(loadState);
    }
}
