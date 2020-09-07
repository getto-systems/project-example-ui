import { VNode } from "preact";
import { html } from "htm/preact";

import { LoadState } from "../../../ability/script/data";

export function appendScript(state: LoadState): void {
    // script タグは body.appendChild しないとスクリプトがロードされないので useEffect で追加する
    if (state.state === "succeed-to-load") {
        const script = document.createElement("script");
        script.src = state.path.path;
        document.body.appendChild(script);
    }
}

export function view(state: LoadState): VNode {
    switch (state.state) {
        case "initial-load":
            return html``

        case "try-to-load":
            // path の取得には時間がかからないはずなので空を返す
            return html``

        case "failed-to-load":
            // TODO エラー画面を用意
            return html`load-error: ${state.err}`

        case "succeed-to-load":
            // script の追加は appendScript でするので、本体は空で返す
            return html``
    }
}
