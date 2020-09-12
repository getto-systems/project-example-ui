import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    LoadApplicationComponent,
    LoadApplicationComponentEventInit,
} from "../../auth/load_application/action"

export interface PreactComponent {
    (): VNode
}

export function LoadApplication(component: LoadApplicationComponent, initEvent: LoadApplicationComponentEventInit): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(component.initialState)
        const event = initEvent(setState)

        useEffect(() => {
            // script タグは body.appendChild しないとスクリプトがロードされないので useEffect で追加する
            if (state.type === "try-to-load") {
                const script = document.createElement("script")
                script.src = state.scriptPath.scriptPath
                document.body.appendChild(script)
            }
        }, [state])

        switch (state.type) {
            case "initial-load":
                component.load(event, location)
                return html``

            case "try-to-load":
                // script の追加は appendScript でするので、本体は空で返す
                return html``

            case "failed-to-load":
                // TODO エラー画面を用意
                return html`ERROR: ${state.err}`
        }
    }
}
