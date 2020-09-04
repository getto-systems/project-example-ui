import { VNode } from "preact";
import { useState, useEffect } from "preact/hooks";

import { appendScript, view } from "./load_script/view";

import { LoadScriptState, LoadScriptComponent } from "../../load/load_script";

interface PreactComponent {
    (): VNode
}

export function LoadScript(initialState: LoadScriptState, baseComponent: LoadScriptComponent): PreactComponent {
    const component = new LoadScriptPreactComponentImpl(baseComponent);

    return (): VNode => {
        const state = component.useState(...useState(initialState));

        useEffect(() => {
            appendScript(state);
        }, [state]);

        return view(state);
    }
}

class LoadScriptPreactComponentImpl {
    component: LoadScriptComponent
    setState: LoadScriptSetState

    constructor(component: LoadScriptComponent) {
        this.component = component;
        this.setState = (_state: LoadScriptState) => {
            // useState() で再設定されるのでここには到達しない
            throw new Error("NEVER");
        }
    }

    useState(state: LoadScriptState, setState: LoadScriptSetState): LoadScriptState {
        this.setState = setState;

        const next = this.component.nextState(state);
        if (next.hasNext) {
            next.promise.then(this.setState);
        }

        return state;
    }
}

interface LoadScriptSetState {
    (state: LoadScriptState): void
}
