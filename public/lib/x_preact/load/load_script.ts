import { VNode } from "preact";
import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";
import { LoadScriptState } from "../../load/load_script";
import { LoadedScript } from "../../load/script/data";

interface PreactComponent {
    (): VNode
}

export function LoadScript(initialState: LoadScriptState): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialState);

        useEffect(() => {
            // script タグは body.appendChild しないとスクリプトがロードされないので useEffect で追加する
            if (state.state === "loaded" && state.script.success) {
                appendScript(state.script.path.path);
            }
        }, [state]);

        switch (state.state) {
            case "initial":
                state.next.then(setState);

                return viewInitial();

            case "loaded":
                return viewLoaded(state.script);

            default:
                return assertNever(state);
        }
    }
}

function viewInitial(): VNode {
    // path の取得には時間がかからないはずなので空を返す
    return html``
}

function viewLoaded(script: LoadedScript): VNode {
    if (script.success) {
        // script の描画は useEffect でするので、本体は空で返す
        return html``
    } else {
        // TODO エラー画面を用意
        return html`load-error: ${script.err.err}`
    }
}

function appendScript(path: string) {
    const script = document.createElement("script");
    script.src = path;
    document.body.appendChild(script);
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
