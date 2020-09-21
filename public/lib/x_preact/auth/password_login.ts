import { VNode } from "preact"
import { useState, useRef, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { LoginView } from "./layout"
import { LoginIDField } from "./field/login_id"
import { PasswordField } from "./field/password"

import { PasswordLoginComponent } from "../../auth/password_login/component"
import { initialPasswordLoginComponentState } from "../../auth/password_login/data"

import { LoginError } from "../../password_login/data"

interface PreactComponent {
    (): VNode
}

export function PasswordLogin(component: PasswordLoginComponent): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialPasswordLoginComponentState)
        const submit = useRef<HTMLButtonElement>()
        useEffect(() => {
            component.init(setState)
            return () => component.terminate()
        }, [])

        function view(onSubmit: Handler<Event>, content: VNode): VNode {
            return LoginView(html`
                <big>
                    <form onSubmit="${onSubmit}">
                        ${loginFields(component)}
                        <section class="login__footer button__container">
                            ${content}
                            ${passwordResetLink()}
                        </section>
                    </form>
                </big>
            `)
        }

        switch (state.type) {
            case "initial-login":
                return view(onSubmit_login, html`
                    <div>
                        ${loginButton()}
                    </div>
                `)

            case "failed-to-login":
                return view(onSubmit_login, html`
                    <div>
                        ${loginButton()}
                        ${loginMessage("form_error", loginError(state.err))}
                    </div>
                `)

            case "try-to-login":
                return view(onSubmit_noop, html`
                    <div>
                        ${loginButton_connecting()}
                    </div>
                `)

            case "delayed-to-login":
                return view(onSubmit_noop, html`
                    <div>
                        ${loginButton_connecting()}
                        ${loginMessage("form_warning", html`
                            <p class="form__message">認証に時間がかかっています</p>
                            <p class="form__message">
                                30秒以上かかるようであれば何かがおかしいので、お手数ですが管理者に連絡してください
                            </p>
                        `)}
                    </div>
                `)

            case "succeed-to-login":
                return html``
        }

        function loginButton() {
            return html`<button ref="${submit}" class="button button_save">ログイン</button>`
        }
        function loginButton_connecting(): VNode {
            return html`
                <button type="button" class="button button_saving">
                    ログインしています
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

            component.trigger({ type: "login" })
        }
        function onSubmit_noop(e: Event) {
            e.preventDefault()
        }
    }
}

function loginFields(component: PasswordLoginComponent): VNode {
    return html`
        <section class="login__body">
            <${LoginIDField(component)}/>
            <${PasswordField(component)}/>
        </section>
    `
}
function loginMessage(messageClass: string, content: VNode): VNode {
    return html`
        <div class="vertical vertical_small"></div>
        <dl class="${messageClass}">
            <dd>${content}</dd>
        </dl>
    `
}
function passwordResetLink(): VNode {
    return html`
        <div class="login__link">
            <a href="?_password_reset"><i class="lnir lnir-question-circle"></i> パスワードがわからない方</a>
        </div>
    `
}

function loginError(err: LoginError): VNode {
    switch (err.type) {
        case "validation-error":
            return html`<p class="form__message">正しく入力してください</p>`

        case "bad-request":
            return html`<p class="form__message">アプリケーションエラーにより認証に失敗しました</p>`

        case "invalid-password-login":
            return html`<p class="form__message">ログインIDかパスワードが違います</p>`

        case "server-error":
            return html`<p class="form__message">サーバーエラーにより認証に失敗しました</p>`

        case "bad-response":
            return html`<p class="form__message">レスポンスエラーにより認証に失敗しました</p>`

        case "infra-error":
            return html`<p class="form__message">ネットワークエラーにより認証に失敗しました</p>`
    }
}

interface Handler<T> {
    (event: T): void
}
