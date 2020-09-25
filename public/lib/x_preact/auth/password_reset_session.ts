import { h, VNode } from "preact"
import { useState, useRef, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { LoginHeader, ErrorView } from "./layout"
import { LoginIDField } from "./password_reset_session/field/login_id"

import { TopLink } from "../../link"

import {
    PasswordResetSessionComponent,
    initialPasswordResetSessionState,
} from "../../auth/component/password_reset_session/component"

import { Destination, PollingStatus, StartSessionError, PollingStatusError, SendTokenError } from "../../password_reset/data"

type Props = Readonly<{
    component: PasswordResetSessionComponent
    link: TopLink
}>

export function PasswordResetSession(props: Props): VNode {
    const [state, setState] = useState(initialPasswordResetSessionState)
    const submit = useRef<HTMLButtonElement>()
    useEffect(() => {
        props.component.onStateChange(setState)
        return props.component.init()
    }, [])

    function startSessionView(onSubmit: Handler<Event>, button: VNode, footer: VNode): VNode {
        return html`
            <aside class="login">
                <form class="login__box" onSubmit="${onSubmit}">
                    ${LoginHeader()}
                    <section>
                        <big>
                            <section class="login__body">
                                ${h(LoginIDField, props)}
                            </section>
                        </big>
                    </section>
                    <footer class="login__footer">
                        <div class="button__container">
                            <div>
                                <big>${button}</big>
                            </div>
                            ${loginLink(props.link)}
                        </div>
                        ${footer}
                    </footer>
                </form>
            </aside>
        `
    }
    function pollingStatusView(content: VNode): VNode {
        return html`
            <aside class="login">
                <section class="login__box">
                    ${LoginHeader()}
                    <section>
                        <big>
                            <section class="loading loading_login">
                                <i class="lnir lnir-spinner lnir-is-spinning"></i>
                                ${content}
                            </section>
                        </big>
                    </section>
                    <footer class="login__footer button__container"></footer>
                </section>
            </aside>
        `
    }
    function errorView(title: VNode, content: VNode): VNode {
        return ErrorView(title, html`
            ${content}
            <div class="vertical vertical_medium"></div>
            <p>お手数ですが、上記メッセージを管理者にお伝えください</p>
        `, html`
            <section class="button__container">
                <div></div>
                ${loginLink(props.link)}
            </section>
        `)
    }

    switch (state.type) {
        case "initial-reset-session":
            return startSessionView(onSubmit_startSession, startSessionButton(), html``)

        case "failed-to-start-session":
            return startSessionView(onSubmit_startSession, startSessionButton(), html`
                <aside>
                    ${formMessage("form_error", startSessionError(state.err))}
                </aside>
            `)

        case "try-to-start-session":
            return startSessionView(onSubmit_noop, startSessionButton_connecting(), html``)

        case "delayed-to-start-session":
            return startSessionView(onSubmit_noop, startSessionButton_connecting(), html`
                <aside>
                    ${formMessage("form_warning", html`
                        <p class="form__message">トークンの送信に時間がかかっています</p>
                        <p class="form__message">
                            30秒以上かかるようであれば何かがおかしいので、お手数ですが管理者に連絡してください
                        </p>
                    `)}
                </aside>
            `)

        case "try-to-polling-status":
            return pollingStatusView(html`
                <p class="loading__message">リセットトークンを送信しています</p>
            `)

        case "retry-to-polling-status":
            return pollingStatusView(html`
                <p class="loading__message">リセットトークンを送信しています</p>
                ${pollingStatus(state.dest, state.status)}
            `)

        case "failed-to-polling-status":
            return errorView(html`ステータスの取得に失敗しました`, pollingStatusError(state.err))

        case "failed-to-send-token":
            return errorView(html`リセットトークンの送信に失敗しました`, sendTokenError(state.err))

        case "succeed-to-send-token":
            return ErrorView(html`リセットトークンを送信しました`, sendTokenMessage(state.dest), html`
                <section class="button__container">
                    <div></div>
                    ${loginLink(props.link)}
                </section>
            `)
    }

    function startSessionButton() {
        return html`<button ref="${submit}" class="button button_save">トークン送信</button>`
    }
    function startSessionButton_connecting(): VNode {
        return html`
            <button type="button" class="button button_saving">
                トークンを送信しています
                ${" "}
                <i class="lnir lnir-spinner lnir-is-spinning"></i>
            </button>
        `
    }

    function onSubmit_startSession(e: Event) {
        e.preventDefault()

        if (submit.current) {
            submit.current.blur()
        }

        props.component.trigger({ type: "start-session" })
    }
    function onSubmit_noop(e: Event) {
        e.preventDefault()
    }
}

function formMessage(messageClass: string, content: VNode): VNode {
    return html`
        <div class="vertical vertical_small"></div>
        <dl class="${messageClass}">
            <dd>${content}</dd>
        </dl>
    `
}

function loginLink(link: TopLink): VNode {
    return html`
        <div class="login__link">
            <a href="${link.auth.passwordLoginHref()}">
                <i class="lnir lnir-user"></i> ログインIDとパスワードでログインする
            </a>
        </div>
    `
}

function pollingStatus(dest: Destination, status: PollingStatus): VNode {
    if (!status.sending) {
        return html`
            <p class="loading__message">送信準備中</p>
        `
    }

    switch (dest.type) {
        case "log":
            return html`
                <p class="loading__message">送信処理中</p>
            `
    }
}
function sendTokenMessage(dest: Destination): VNode {
    switch (dest.type) {
        case "log":
            return html`
                <p>サーバーのログに記載されたリセットトークンを確認してください</p>
            `
    }
}

function startSessionError(err: StartSessionError): VNode {
    switch (err.type) {
        case "validation-error":
            return html`<p class="form__message">正しく入力してください</p>`

        case "bad-request":
            return html`<p class="form__message">アプリケーションエラーによりトークンの送信に失敗しました</p>`

        case "invalid-password-reset":
            return html`<p class="form__message">ログインIDが登録されていないか、トークンの送信先が登録されていません</p>`

        case "server-error":
            return html`<p class="form__message">サーバーエラーによりトークンの送信に失敗しました</p>`

        case "bad-response":
            return html`
                <p class="form__message">レスポンスエラーによりトークンの送信に失敗しました</p>
                <p class="form__message">(詳細: ${err.err})</p>
            `

        case "infra-error":
            return html`
                <p class="form__message">ネットワークエラーによりトークンの送信に失敗しました</p>
                <p class="form__message">(詳細: ${err.err})</p>
            `
    }
}
function pollingStatusError(err: PollingStatusError): VNode {
    switch (err.type) {
        case "bad-request":
            return html`<p>アプリケーションエラーによりステータスの取得に失敗しました</p>`

        case "invalid-password-reset":
            return html`<p>セッションエラーによりステータスの取得に失敗しました</p>`

        case "server-error":
            return html`<p>サーバーエラーによりステータスの取得に失敗しました</p>`

        case "bad-response":
            return html`
                <p>レスポンスエラーによりステータスの取得に失敗しました</p>
                <p>(詳細: ${err.err})</p>
            `

        case "infra-error":
            return html`
                <p>ネットワークエラーによりステータスの取得に失敗しました</p>
                <p>(詳細: ${err.err})</p>
            `
    }
}
function sendTokenError(err: SendTokenError): VNode {
    switch (err.type) {
        case "infra-error":
            return html`
                <p>サーバーエラーによりリセットトークンの送信に失敗しました</p>
                <p>(詳細: ${err.err})</p>
            `
    }
}

interface Handler<T> {
    (event: T): void
}
