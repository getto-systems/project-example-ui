import { VNode } from "preact";
import { useState, useEffect } from "preact/hooks";
import { html } from "htm/preact";

import { LoadApplicationComponent } from "../../auth/load_application";

export interface PreactComponent {
    (): VNode
}

export function LoadApplication(component: LoadApplicationComponent): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(component.initialState());
        component.onStateChange(setState);

        useEffect(() => {
            // script タグは body.appendChild しないとスクリプトがロードされないので useEffect で追加する
            if (state.type === "succeed-to-load") {
                const script = document.createElement("script");
                script.src = state.scriptPath.scriptPath;
                document.body.appendChild(script);
            }
        }, [state]);

        switch (state.type) {
            case "initial-load":
                component.load();
                return html``

            case "try-to-load":
                // path の取得には時間がかからないはずなので空を返す
                return html``

            case "failed-to-load":
                // TODO エラー画面を用意
                return html`ERROR: ${state.err}`

            case "succeed-to-load":
                // script の追加は appendScript でするので、本体は空で返す
                return html``
        }
    }
}
