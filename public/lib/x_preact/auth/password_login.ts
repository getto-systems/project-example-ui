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

        switch (state.type) {
            case "initial-login":
                return LoginView(initialLoginForm(component, loginButton(), onSubmit))

            case "failed-to-login":
                return LoginView(failedToLoginForm(component, state.err, loginButton(), onSubmit))

            case "try-to-login":
                return LoginView(tryToLoginForm(component, loginButton_connecting()))

            case "delayed-to-login":
                return LoginView(delayedToLoginForm(component, loginButton_connecting()))

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
        function onSubmit(e: Event) {
            e.preventDefault()

            if (submit.current) {
                submit.current.blur()
            }

            component.trigger({ type: "login" })
        }
    }
}

function initialLoginForm(component: PasswordLoginComponent, button: VNode, onSubmit: Handler<Event>): VNode {
    return html`
        <big>
            <form onSubmit="${onSubmit}">
                ${loginFields(component)}
                <section class="login__footer button__container">
                    <div>
                        ${button}
                    </div>
                    ${passwordResetLink()}
                </section>
            </form>
        </big>
    `
}
function failedToLoginForm(component: PasswordLoginComponent, err: LoginError, button: VNode, onSubmit: Handler<Event>): VNode {
    return html`
        <big>
            <form onSubmit="${onSubmit}">
                ${loginFields(component)}
                <section class="login__footer button__container">
                    <div>
                        ${button}
                        <div class="vertical vertical_small"></div>
                        ${error()}
                    </div>
                    ${passwordResetLink()}
                </section>
            </form>
        </big>
    `

    function error(): VNode {
        return html`
            <dl class="form_error">
                <dd>
                    ${message()}
                </dd>
            </dl>
        `

        function message(): VNode {
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
    }
}
function tryToLoginForm(component: PasswordLoginComponent, button: VNode): VNode {
    return html`
        <big>
            <section>
                ${loginFields(component)}
                <section class="login__footer button__container">
                    <div>
                        ${button}
                    </div>
                    ${passwordResetLink()}
                </section>
            </section>
        </big>
    `
}
function delayedToLoginForm(component: PasswordLoginComponent, button: VNode): VNode {
    return html`
        <big>
            <section>
                ${loginFields(component)}
                <section class="login__footer button__container">
                    <div>
                        ${button}
                        <dl class="form form_warning">
                            <dd class="form__field">
                                <p class="form__message">認証に時間がかかっています</p>
                                <p class="form__message">
                                    30秒以上かかるようであれば何かがおかしいので、お手数ですが管理者に連絡してください
                                </p>
                            </dd>
                        </dl>
                    </div>
                    ${passwordResetLink()}
                </section>
            </section>
        </big>
    `
}

function loginFields(component: PasswordLoginComponent): VNode {
    return html`
        <section class="login__body">
            <${LoginIDField(component)}/>
            <${PasswordField(component)}/>
        </section>
    `
}
function passwordResetLink(): VNode {
    return html`
        <div class="login__link">
            <a href="#"><i class="lnir lnir-question-circle"></i> パスワードがわからない方</a>
        </div>
    `
}

interface Handler<T> {
    (event: T): void
}
