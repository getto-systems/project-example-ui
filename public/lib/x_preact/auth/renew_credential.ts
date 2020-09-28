import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { loginError } from "../layout"

import { ApplicationError } from "../application_error"

import { unpackScriptPath } from "../../script/adapter"

import {
    RenewCredentialComponent,
    RenewCredentialParam,
    initialRenewCredentialState,
    initialRenewCredentialSend,
} from "../../auth/component/renew_credential/component"

import { RenewError } from "../../credential/data"
import { ScriptPath } from "../../script/data"

type Props = {
    component: RenewCredentialComponent
    param: RenewCredentialParam
}

export function RenewCredential(props: Props): VNode {
    const [state, setState] = useState(initialRenewCredentialState)
    const [send, setSend] = useState(() => initialRenewCredentialSend)
    useEffect(() => {
        props.component.onStateChange(setState)
        return mapResource(props.component.init(), (send) => {
            setSend(() => send)
            send({ type: "set-param", param: props.param })
            send({ type: "renew" })
        })
    }, [])

    useEffect(() => {
        switch (state.type) {
            case "try-to-instant-load":
                appendScript(state.scriptPath, (script) => {
                    script.onload = () => {
                        send({ type: "succeed-to-instant-load" })
                    }
                    script.onerror = (err) => {
                        send({ type: "failed-to-load", err: { type: "infra-error", err: `${err}` } })
                    }
                })
                break

            case "succeed-to-renew":
                appendScript(state.scriptPath, (script) => {
                    script.onerror = (err) => {
                        send({ type: "failed-to-load", err: { type: "infra-error", err: `${err}` } })
                    }
                })
                break

        }

        function appendScript(scriptPath: ScriptPath, setup: { (script: HTMLScriptElement): void }): void {
            const script = document.createElement("script")
            script.src = unpackScriptPath(scriptPath)
            setup(script)
            document.body.appendChild(script)
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

        case "failed-to-store":
        case "failed-to-load":
            return h(ApplicationError, { err: state.err.err })

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

function mapResource<T>(resource: Resource<T>, init: Init<T>): Terminate {
    init(resource.send)
    return resource.terminate
}

interface Init<T> {
    (send: Post<T>): void
}
interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}

type Resource<T> = Readonly<{
    send: Post<T>
    terminate: Terminate
}>
