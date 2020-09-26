import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { loginError } from "../layout"
import { ApplicationError } from "../application_error"

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
        return props.component.init()
    }, [])

    useEffect(() => {
        props.component.trigger({ type: "set-param", param: props.param })
    }, [props.param])

    useEffect(() => {
        if (state.type === "initial-renew") {
            props.component.trigger({ type: "renew" })
        }
    }, [state])


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

        case "error":
            return h(ApplicationError, { err: state.err })
    }

    function delayedContent(): VNode {
        return loginError(
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
        return loginError(
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
