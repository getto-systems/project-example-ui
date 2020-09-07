import { VNode } from "preact";
import { html } from "htm/preact";

import { ScriptState } from "../../../ability/script/data";

export function appendScript(state: ScriptState): void {
    // script タグは body.appendChild しないとスクリプトがロードされないので useEffect で追加する
    if (state.state === "succeed-to-load-script") {
        const script = document.createElement("script");
        script.src = state.scriptPath.scriptPath;
        document.body.appendChild(script);
    }
}

export function view(state: ScriptState): VNode {
    switch (state.state) {
        case "initial-script":
            return html``

        case "try-to-load-script":
            // path の取得には時間がかからないはずなので空を返す
            return html``

        case "failed-to-load-script":
            // TODO エラー画面を用意
            return html`load-error: ${state.err}`

        case "succeed-to-load-script":
            // script の追加は appendScript でするので、本体は空で返す
            return html``
    }
}
