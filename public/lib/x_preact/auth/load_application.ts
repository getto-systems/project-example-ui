import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { LoadApplicationComponent } from "../../auth/load_application/data"

import { initialLoadApplicationComponentState } from "../../auth/load_application/data"

export interface PreactComponent {
    (): VNode
}

export function LoadApplication(component: LoadApplicationComponent): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialLoadApplicationComponentState)
        useEffect(() => {
            component.init(setState)
            component.trigger({ type: "load", pagePathname: { pagePathname: new URL(location.toString()).pathname } })
            return () => component.terminate()
        }, [])

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
