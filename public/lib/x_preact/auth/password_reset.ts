import { VNode } from "preact"
import { useState, useRef, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { LoginView } from "./layout"
import { LoginIDField } from "./password_reset/field/login_id"
import { PasswordField } from "./password_reset/field/password"

import { PasswordResetComponent } from "../../auth/password_reset/component"
import { initialPasswordResetState } from "../../auth/password_reset/data"

import { ResetToken, ResetError } from "../../password_reset/data"

interface PreactComponent {
    (): VNode
}

export function PasswordReset(component: PasswordResetComponent, resetToken: ResetToken): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialPasswordResetState)
        const submit = useRef<HTMLButtonElement>()
        useEffect(() => {
            component.onStateChange(setState)
            return () => component.terminate()
        }, [])

        function view(onSubmit: Handler<Event>, button: VNode, footer: VNode): VNode {
            return LoginView(html`
                <form onSubmit="${onSubmit}">
                    <big>
                        <section class="login__body">
                            <${LoginIDField(component)}/>
                            <${PasswordField(component)}/>
                        </section>
                    </big>
                </form>
                <footer class="login__footer">
                    <div class="button__container">
                        <div>
                            <big>${button}</big>
                        </div>
                        <div class="login__link">
                            <a href="?_password_reset">
                                <i class="lnir lnir-direction"></i> トークンを再送信する
                            </a>
                        </div>
                    </div>
                    ${footer}
                </footer>
            `)
        }

        switch (state.type) {
            case "initial-reset":
                return view(onSubmit_login, resetButton(), html``)

            case "failed-to-reset":
                return view(onSubmit_login, resetButton(), html`
                    <aside>
                        ${formMessage("form_error", resetError(state.err))}
                    </aside>
                `)

            case "try-to-reset":
                return view(onSubmit_noop, resetButton_connecting(), html``)

            case "delayed-to-reset":
                return view(onSubmit_noop, resetButton_connecting(), html`
                    <aside>
                        ${formMessage("form_warning", html`
                            <p class="form__message">リセットに時間がかかっています</p>
                            <p class="form__message">
                                30秒以上かかるようであれば何かがおかしいので、お手数ですが管理者に連絡してください
                            </p>
                        `)}
                    </aside>
                `)

            case "succeed-to-reset":
                return html``
        }

        function resetButton() {
            return html`<button ref="${submit}" class="button button_save">パスワードリセット</button>`
        }
        function resetButton_connecting(): VNode {
            return html`
                <button type="button" class="button button_saving">
                    パスワードをリセットしています
                    ${" "}
                    <i class="lnir lnir-spinner lnir-is-spinning"></i>
                </button>
            `
        }

        function onSubmit_login(e: Event) {
            e.preventDefault()

            if (submit.current) {
                submit.current.blur()
            }

            component.trigger({ type: "reset", resetToken })
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

function resetError(err: ResetError): VNode {
    switch (err.type) {
        case "validation-error":
            return html`<p class="form__message">正しく入力してください</p>`

        case "bad-request":
            return html`<p class="form__message">アプリケーションエラーにより認証に失敗しました</p>`

        case "invalid-password-reset":
            return html`<p class="form__message">ログインIDが最初に入力したものと違います</p>`

        case "server-error":
            return html`<p class="form__message">サーバーエラーにより認証に失敗しました</p>`

        case "bad-response":
            return html`
                <p class="form__message">レスポンスエラーにより認証に失敗しました</p>
                <p class="form__message">(詳細: ${err.err})</p>
            `

        case "infra-error":
            return html`
                <p class="form__message">ネットワークエラーにより認証に失敗しました</p>
                <p class="form__message">(詳細: ${err.err})</p>
            `
    }
}

interface Handler<T> {
    (event: T): void
}
