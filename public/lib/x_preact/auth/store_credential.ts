import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { ErrorView } from "./layout"

import { StoreCredentialComponent, initialStoreCredentialState } from "../../auth/component/store_credential"

import { AuthCredential, StoreError } from "../../credential/data"

export interface PreactComponent {
    (): VNode
}

export function StoreCredential(component: StoreCredentialComponent, authCredential: AuthCredential): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialStoreCredentialState)
        useEffect(() => {
            component.onStateChange(setState)
            component.store(authCredential)
            return () => component.terminate()
        }, [])

        switch (state.type) {
            case "initial-store":
            case "succeed-to-store":
                return html``

            case "failed-to-store":
                return ErrorView(...failedContent(state.err))
        }
    }

    function failedContent(err: StoreError): [VNode, VNode, VNode] {
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
