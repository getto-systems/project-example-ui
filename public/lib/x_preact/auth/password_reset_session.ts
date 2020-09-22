import { VNode } from "preact"
import { useState, useRef, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { LoginView } from "./layout"
import { LoginIDField } from "./field/login_id"

import { PasswordResetSessionComponent } from "../../auth/password_reset_session/component"
import { initialPasswordResetSessionComponentState } from "../../auth/password_reset_session/data"

import { Destination, PollingStatus, CreateSessionError, PollingStatusError, SendTokenError } from "../../password_reset/data"

interface PreactComponent {
    (): VNode
}

export function PasswordResetSession(component: PasswordResetSessionComponent): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialPasswordResetSessionComponentState)
        const submit = useRef<HTMLButtonElement>()
        useEffect(() => {
            component.init(setState)
            return () => component.terminate()
        }, [])

        function createSessionView(onSubmit: Handler<Event>, button: VNode, footer: VNode): VNode {
            return LoginView(html`
                <form onSubmit="${onSubmit}">
                    <big>
                        <section class="login__body">
                            <${LoginIDField(component)}/>
                        </section>
                    </big>
                </form>
                <footer class="login__footer">
                    <div class="button__container">
                        <div>
                            <big>${button}</big>
                        </div>
                        ${loginLink()}
                    </div>
                    ${footer}
                </footer>
            `)
        }
        function pollingStatusView(content: VNode): VNode {
            return LoginView(html`
                <section>
                    <big>
                        <section class="loading loading_login">
                            <i class="lnir lnir-spinner lnir-is-spinning"></i>
                            ${content}
                        </section>
                    </big>
                </section>
                <footer class="login__footer button__container">
                </footer>
            `)
        }
        function errorView(title: VNode, content: VNode): VNode {
            return LoginView(html`
                <section class="login__message">
                    <h3 class="login__message__title">${title}</h3>
                    <section class="login__message__body paragraph">
                        ${content}
                        <div class="vertical vertical_medium"></div>
                        <p>お手数ですが、上記メッセージを管理者にお伝えください</p>
                    </section>
                </section>
                <footer class="login__footer button__container">
                    <div></div>
                    ${loginLink()}
                </footer>
            `)
        }

        switch (state.type) {
            case "initial-reset-session":
                return createSessionView(onSubmit_createSession, createSessionButton(), html``)

            case "failed-to-create-session":
                return createSessionView(onSubmit_createSession, createSessionButton(), html`
                    <aside>
                        ${formMessage("form_error", createSessionError(state.err))}
                    </aside>
                `)

            case "try-to-create-session":
                return createSessionView(onSubmit_noop, createSessionButton_connecting(), html``)

            case "delayed-to-create-session":
                return createSessionView(onSubmit_noop, createSessionButton_connecting(), html`
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
                return LoginView(html`
                    <section class="login__message">
                        <h3 class="login__message__title">リセットトークンを送信しました</h3>
                        <section class="login__message__body paragraph">
                            ${sendTokenMessage(state.dest)}
                        </section>
                    </section>
                    <footer class="login__footer button__container">
                        <div></div>
                        ${loginLink()}
                    </footer>
                `)
        }

        function createSessionButton() {
            return html`<button ref="${submit}" class="button button_save">トークン送信</button>`
        }
        function createSessionButton_connecting(): VNode {
            return html`
                <button type="button" class="button button_saving">
                    トークンを送信しています
                    ${" "}
                    <i class="lnir lnir-spinner lnir-is-spinning"></i>
                </button>
            `
        }

        function onSubmit_createSession(e: Event) {
            e.preventDefault()

            if (submit.current) {
                submit.current.blur()
            }

            component.trigger({ type: "create-session" })
        }
        function onSubmit_noop(e: Event) {
            e.preventDefault()
        }
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

function loginLink(): VNode {
    return html`
        <div class="login__link">
            <a href="?_password_login">
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

function createSessionError(err: CreateSessionError): VNode {
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
