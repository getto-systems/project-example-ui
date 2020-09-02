import { VNode } from "preact";
import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";
import { LoadScriptState } from "../../load/load_script";

interface component {
    (): VNode
}

export function LoadScript(initialState: LoadScriptState): component {
    return (): VNode => {
        const [state, setState] = useState(initialState);

        useEffect(() => {
            // script タグは body.appendChild しないとスクリプトがロードされないので useEffect で追加する
            if (state.state === "loaded" && state.script.success) {
                const script = document.createElement("script");
                script.src = state.script.path.path;
                document.body.appendChild(script);
            }
        }, [state]);

        switch (state.state) {
            case "initial":
                state.next.then(setState);

                // path の取得には時間がかからないはずなので空を返す
                return html``

            case "loaded":
                if (state.script.success) {
                    // script の描画は useEffect でするので、本体は空で返す
                    return html``
                } else {
                    // TODO エラー画面を用意
                    return html`load-error: ${state.script.err.err}`
                }

            default:
                return assertNever(state);
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
