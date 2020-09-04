import { VNode } from "preact";
import { html } from "htm/preact";

import { LoadScriptState } from "../../../load/load_script";

import { LoadedScript } from "../../../load/script/data";

export function appendScript(state: LoadScriptState): void {
    // script タグは body.appendChild しないとスクリプトがロードされないので useEffect で追加する
    if (state.state === "loaded" && state.script.success) {
        const script = document.createElement("script");
        script.src = state.script.path.path;
        document.body.appendChild(script);
    }
}

export function view(state: LoadScriptState): VNode {
    switch (state.state) {
        case "initial":
            return viewInitial();

        case "loaded":
            return viewLoaded(state.script);

        default:
            return assertNever(state);
    }
}

function viewInitial(): VNode {
    // path の取得には時間がかからないはずなので空を返す
    return html``
}

function viewLoaded(script: LoadedScript): VNode {
    if (!script.success) {
        // TODO エラー画面を用意
        return html`load-error: ${script.err.err}`
    }
    // script の追加は appendScript でするので、本体は空で返す
    return html``
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
