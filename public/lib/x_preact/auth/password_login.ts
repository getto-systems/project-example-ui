import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { LoginView } from "./login_view"
import { LoginIDField } from "./field/login_id"
import { PasswordField } from "./field/password"

import {
    PasswordLoginComponent,
    initialPasswordLoginComponentState,
} from "../../auth/password_login/action"

import { InputContent, LoginError } from "../../password_login/data"
import { hasValue, noValue } from "../../field/data"

interface PreactComponent {
    (): VNode
}

export function PasswordLogin(component: PasswordLoginComponent): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialPasswordLoginComponentState)
        useEffect(() => {
            component.init(setState)
            return () => component.terminate()
        }, [])

        switch (state.type) {
            case "initial-login":
                return LoginView(initialLoginForm(component))

            case "failed-to-login":
                return LoginView(failedToLoginForm(component, state.content, state.err))

            case "try-to-login":
                return LoginView(tryToLoginForm())

            case "delayed-to-login":
                return LoginView(delayedToLoginForm())

            case "succeed-to-login":
                return html``
        }
    }
}

function initialLoginForm(component: PasswordLoginComponent): VNode {
    return html`
        <form onSubmit="${onSubmit}">
            <big>
                <section class="login__body">
                    <${LoginIDField(component.field.loginID)} initial="${noValue}"/>
                    <${PasswordField(component.field.password)} initial="${noValue}"/>
                </section>
            </big>
            <big>
                <section class="login__footer button__container">
                    <div>
                        ${loginButton()}
                    </div>
                    <div class="login__link">
                        ${passwordResetLink()}
                    </div>
                </section>
            </big>
        </form>
    `

    function onSubmit(e: Event) {
        loginFormSubmit(e)
        component.trigger({ type: "login" })
    }
}
function failedToLoginForm(component: PasswordLoginComponent, content: InputContent, err: LoginError): VNode {
    return html`
        <form onSubmit="${onSubmit}">
            <big>
                <section class="login__body">
                    <${LoginIDField(component.field.loginID)} initial="${hasValue(content.loginID)}"/>
                    <${PasswordField(component.field.password)} initial="${hasValue(content.password)}"/>
                </section>
            </big>
            <big>
                <section class="login__footer button__container">
                    <div>
                        ${loginButton()}
                        <div class="vertical vertical_small"></div>
                        ${error()}
                    </div>
                    <div class="login__link">
                        ${passwordResetLink()}
                    </div>
                </section>
            </big>
        </form>
    `

    function onSubmit(e: Event) {
        loginFormSubmit(e)
        component.trigger({ type: "login" })
    }

    function error(): VNode {
        return html`
            <dl class="form form_error">
                <dd class="form__field">
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

function loginButton(): VNode {
    // id="login-submit" は onSubmit で button.blur() するのに使用している
    // SubmitEvent が使用可能になったら不必要になる
    return html`<button id="login-submit" class="button button_save">ログイン</button>`
}
function loginFormSubmit(e: Event): void {
    e.preventDefault()

    // submitter を blur する
    blurLoginButton()
}
function blurLoginButton(): void {
    // submitter を blur する
    // SubmitEvent が使えないので直接 getElementById している
    const button = document.getElementById("login-submit")
    if (button) {
        button.blur()
    }
}

function passwordResetLink(): VNode {
    return html`<a href="#"><i class="lnir lnir-question-circle"></i> パスワードがわからない方</a>`
}

function tryToLoginForm(): VNode {
    // TODO 「ログインしています」にスタイルをあてる
    // spinner だけ、でもいいかな
    return html`
        <div>
            <big>
                ログインしています
            </big>
        </div>
    `
}
function delayedToLoginForm(): VNode {
    // TODO 「ログインしています」にスタイルをあてる
    // こっちはちゃんとしたメッセージとともに表示する
    return html`
        <div>
            <big>
                ログインしています
            </big>
            <big>
                <section class="login__footer button__container">
                    <div>
                        <dl class="form form_warning">
                            <dd class="form__field">
                                <p class="form__message">
                                    認証に時間がかかっています <i class="lnir lnir-spinner lnir-is-spinning"></i><br/>
                                    1分以上かかるようであれば何かがおかしいので、お手数ですが管理者に連絡してください
                                </p>
                            </dd>
                        </dl>
                    </div>
                </section>
            </big>
        </div>
    `
}
