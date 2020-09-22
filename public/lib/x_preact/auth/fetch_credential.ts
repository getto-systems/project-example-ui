import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { ErrorView } from "./layout"

import { FetchCredentialComponent } from "../../auth/fetch_credential/component"
import { initialFetchCredentialState } from "../../auth/fetch_credential/data"

import { FetchError } from "../../credential/data"

export interface PreactComponent {
    (): VNode
}

export function FetchCredential(component: FetchCredentialComponent): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialFetchCredentialState)
        useEffect(() => {
            component.onStateChange(setState)
            component.fetch()
            return () => component.terminate()
        }, [])

        switch (state.type) {
            case "initial-fetch":
            case "unauthorized":
            case "succeed-to-fetch":
                return html``

            case "failed-to-fetch":
                return ErrorView(...failedContent(state.err))
        }
    }

    function failedContent(err: FetchError): [VNode, VNode, VNode] {
        return [
            html`アプリケーションの初期化に失敗しました`,
            html`
                <p>ブラウザが LocalStorage にアクセスできませんでした</p>
                <p>(詳細: ${err.err})</p>
                <div class="vertical vertical_medium"></div>
                <p>お手数ですが、上記メッセージを管理者に伝えてください</p>
            `,
            html``,
        ]
    }
}
