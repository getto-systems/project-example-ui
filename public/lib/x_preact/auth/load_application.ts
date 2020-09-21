import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { ErrorView } from "./layout"

import { LoadApplicationComponent } from "../../auth/load_application/component"

import { initialLoadApplicationComponentState } from "../../auth/load_application/data"

import { initPagePathname, scriptPathToString, CheckError } from "../../script/data"

export interface PreactComponent {
    (): VNode
}

export function LoadApplication(component: LoadApplicationComponent): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialLoadApplicationComponentState)
        useEffect(() => {
            component.init(setState)
            component.trigger({ type: "load", pagePathname: initPagePathname(new URL(location.toString())) })
            return () => component.terminate()
        }, [])

        useEffect(() => {
            // script タグは body.appendChild しないとスクリプトがロードされないので useEffect で追加する
            if (state.type === "try-to-load") {
                const script = document.createElement("script")
                script.src = scriptPathToString(state.scriptPath)
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
                return ErrorView(...failedContent(state.err))
        }
    }

    function failedContent(err: CheckError): [VNode, VNode, VNode] {
        return [
            html`アプリケーションの初期化に失敗しました`,
            html`
                ${errorMessage()}
                <div class="vertical vertical_medium"></div>
                <p>お手数ですが、上記メッセージを管理者に伝えてください</p>
            `,
            html``,
        ]

        function errorMessage(): VNode {
            switch (err.type) {
                case "not-found":
                    return html`<p>スクリプトが見つかりませんでした</p>`

                case "infra-error":
                    return html`
                        <p>ネットワーク通信時にエラーが発生しました</p>
                        <p>(詳細: ${err.err})</p>
                    `
            }
        }
    }
}
