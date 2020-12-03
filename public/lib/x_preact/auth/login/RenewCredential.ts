import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { fullScreenError } from "../../layout"
import { appendScript } from "./script"

import { ApplicationError } from "../../System/ApplicationError"

import { RenewCredentialComponentSet } from "../../../auth/login/Login/View/view"
import { initialRenewCredentialState } from "../../../auth/login/Login/renew_credential/component"

import { RenewError } from "../../../auth/login/credential/data"

type Props = Readonly<{
    components: RenewCredentialComponentSet
}>
export function RenewCredential({ components: { renewCredential } }: Props): VNode {
    const [state, setState] = useState(initialRenewCredentialState)
    useEffect(() => {
        renewCredential.onStateChange(setState)
        renewCredential.renew()
    }, [])

    useEffect(() => {
        // スクリプトのロードは appendChild する必要があるため useEffect で行う
        switch (state.type) {
            case "try-to-instant-load":
                appendScript(state.scriptPath, (script) => {
                    script.onload = () => {
                        renewCredential.succeedToInstantLoad()
                    }
                    script.onerror = () => {
                        renewCredential.loadError({
                            type: "infra-error",
                            err: `スクリプトのロードに失敗しました: ${state.type}`,
                        })
                    }
                })
                break

            case "succeed-to-renew":
                appendScript(state.scriptPath, (script) => {
                    script.onerror = () => {
                        renewCredential.loadError({
                            type: "infra-error",
                            err: `スクリプトのロードに失敗しました: ${state.type}`,
                        })
                    }
                })
                break
        }
    }, [state])

    switch (state.type) {
        case "initial":
        case "required-to-login":
            return EMPTY_CONTENT

        case "try-to-instant-load":
        case "succeed-to-renew":
            // スクリプトのロードは appendChild する必要があるため useEffect で行う
            return EMPTY_CONTENT

        case "try-to-renew":
            // すぐに帰ってくるはずなので何も描画しない
            return EMPTY_CONTENT

        case "delayed-to-renew":
            return delayedContent()

        case "failed-to-renew":
            return renewFailedContent(state.err)

        case "storage-error":
        case "load-error":
            return h(ApplicationError, { err: state.err.err })

        case "error":
            return h(ApplicationError, { err: state.err })
    }
}

function delayedContent(): VNode {
    return fullScreenError(
        html`認証に時間がかかっています`,
        html`
            <p>
                30秒以上かかるようなら何かがおかしいので、
                <br />
                お手数ですが管理者に連絡をお願いします。
            </p>
        `,
        html``
    )
}

function renewFailedContent(err: RenewError): VNode {
    return fullScreenError(html`認証に失敗しました`, errorMessage(renewError(err)), html``)
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
