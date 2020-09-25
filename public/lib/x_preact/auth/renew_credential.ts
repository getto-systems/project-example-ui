import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { ErrorView } from "./layout"

import {
    RenewCredentialComponent,
    RenewCredentialParam,
    initialRenewCredentialState,
} from "../../auth/component/renew_credential/component"

import { RenewError, StoreError } from "../../credential/data"

export interface PreactComponent {
    (props: Props): VNode
}

type Props = {
    param: RenewCredentialParam
}

export function RenewCredential(component: RenewCredentialComponent): PreactComponent {
    return (props: Props): VNode => {
        const [state, setState] = useState(initialRenewCredentialState)
        useEffect(() => {
            component.onStateChange(setState)
            component.init()
            component.trigger({ type: "renew", param: props.param })
            return () => component.terminate()
        }, [])

        switch (state.type) {
            case "initial-renew":
            case "required-to-login":
            case "succeed-to-store":
                return EMPTY_CONTENT

            case "try-to-renew":
                // すぐに帰ってくるはずなので何も描画しない
                return EMPTY_CONTENT

            case "delayed-to-renew":
                return delayedContent()

            case "failed-to-store":
                return fetchFailedContent(state.err)

            case "failed-to-renew":
                return renewFailedContent(state.err)
        }
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

    function fetchFailedContent(err: StoreError): VNode {
        return ErrorView(
            html`認証に失敗しました`,
            errorMessage(fetchError(err)),
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

function fetchError(err: StoreError): VNode {
    switch (err.type) {
        case "infra-error":
            return html`
                <p>ブラウザが LocalStorage にアクセスできませんでした</p>
                <p>(詳細: ${err.err})</p>
            `
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
