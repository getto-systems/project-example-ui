import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { ErrorView } from "./layout"

import { RenewCredentialComponent } from "../../auth/renew_credential/component"
import { initialRenewCredentialComponentState } from "../../auth/renew_credential/data"

import { TicketNonce, RenewError } from "../../credential/data"

export interface PreactComponent {
    (): VNode
}

export function RenewCredential(component: RenewCredentialComponent, ticketNonce: TicketNonce): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialRenewCredentialComponentState)
        useEffect(() => {
            component.init(setState)
            component.renew(ticketNonce)
            return () => component.terminate()
        }, [])

        switch (state.type) {
            case "initial-renew":
            case "unauthorized":
            case "succeed-to-renew":
                return html``

            case "try-to-renew":
                // すぐに帰ってくる想定
                return html``

            case "delayed-to-renew":
                return ErrorView(...delayedContent())

            case "failed-to-renew":
                return ErrorView(...failedContent(state.err))
        }
    }

    function delayedContent(): [VNode, VNode, VNode] {
        return [
            html`認証に時間がかかっています`,
            html`
                <p>30秒以上かかるようなら何かがおかしいので、お手数ですが管理者に連絡をお願いします。</p>
            `,
            html``,
        ]
    }

    function failedContent(err: RenewError): [VNode, VNode, VNode] {
        return [
            html`認証に失敗しました`,
            html`
                ${errorMessage()}
                <div class="vertical vertical_medium"></div>
                <p>お手数ですが、上記メッセージを管理者に伝えてください</p>
            `,
            html``,
        ]

        function errorMessage(): VNode {
            switch (err.type) {
                case "bad-request":
                    return html`<p>認証情報の送信処理でエラーが発生しました</p>`

                case "server-error":
                    return html`<p>サーバーの認証処理でエラーが発生しました</p>`

                case "bad-response":
                    return html`
                        <p>サーバーから送信されたデータがエラーでした</p>
                        <p>(詳細: ${err.err})</p>
                    `

                case "infra-error":
                    return html`
                        <p>ネットワーク通信時にエラーが発生しました</p>
                        <p>(詳細: ${err.err})</p>
                    `
            }
        }
    }
}
