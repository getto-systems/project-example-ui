import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { ErrorView } from "./layout"

import {
    RenewCredentialComponent,
    RenewCredentialParam,
    initialRenewCredentialState,
} from "../../auth/component/renew_credential/component"

import { RenewError } from "../../credential/data"

type Props = {
    component: RenewCredentialComponent
    param: RenewCredentialParam
}

export function RenewCredential(props: Props): VNode {
    const [state, setState] = useState(initialRenewCredentialState)
    useEffect(() => {
        props.component.onStateChange(setState)
        props.component.init()
        props.component.trigger({ type: "renew", param: props.param })
        return () => props.component.terminate()
    }, [])

    switch (state.type) {
        case "initial-renew":
        case "required-to-login":
        case "succeed-to-renew":
        case "succeed-to-renew-interval":
            return EMPTY_CONTENT

        case "try-to-renew":
            // すぐに帰ってくるはずなので何も描画しない
            return EMPTY_CONTENT

        case "delayed-to-renew":
            return delayedContent()

        case "failed-to-renew":
            return renewFailedContent(state.err)
    }

    function delayedContent(): VNode {
        return ErrorView(
            html`認証に時間がかかっています`,
            html`
                <p>
                    30秒以上かかるようなら何かがおかしいので、
                    <br/>
                    お手数ですが管理者に連絡をお願いします。
                </p>
            `,
            html``,
        )
    }

    function renewFailedContent(err: RenewError): VNode {
        return ErrorView(
            html`認証に失敗しました`,
            errorMessage(renewError(err)),
            html``,
        )
    }
}

function renewError(err: RenewError): VNode {
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

function errorMessage(content: VNode): VNode {
    return html`
        ${content}
        <div class="vertical vertical_medium"></div>
        <p>お手数ですが、上記メッセージを管理者に伝えてください</p>
    `
}

const EMPTY_CONTENT: VNode = html``
