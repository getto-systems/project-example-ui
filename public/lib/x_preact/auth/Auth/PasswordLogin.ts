import { h, VNode } from "preact"
import { useState, useEffect, useRef } from "preact/hooks"
import { html } from "htm/preact"

import { loginHeader } from "../../layout"
import { appendScript } from "./script"

import { ApplicationError } from "../../System/ApplicationError"

import { LoginIDField } from "./PasswordLogin/LoginIDField"
import { PasswordField } from "./PasswordLogin/PasswordField"

import { PasswordLoginResource } from "../../../auth/Auth/Login/view"
import { initialPasswordLoginState } from "../../../auth/Auth/password_login/component"

import { LoginError } from "../../../auth/login/password_login/data"

type Props = Readonly<{
    components: PasswordLoginResource
}>
export function PasswordLogin({
    components: { passwordLogin, loginIDField, passwordField },
}: Props): VNode {
    const [state, setState] = useState(initialPasswordLoginState)
    // submitter の focus を解除するために必要 : イベントから submitter が取得できるようになったら必要ない
    const submit = useRef<HTMLButtonElement>()
    useEffect(() => {
        passwordLogin.onStateChange(setState)
    }, [])

    useEffect(() => {
        // スクリプトのロードは appendChild する必要があるため useEffect で行う
        switch (state.type) {
            case "succeed-to-login":
                appendScript(state.scriptPath, (script) => {
                    script.onerror = () => {
                        passwordLogin.loadError({
                            type: "infra-error",
                            err: `スクリプトのロードに失敗しました: ${state.type}`,
                        })
                    }
                })
                break
        }
    }, [state])

    function view(onSubmit: Post<Event>, button: VNode, footer: VNode): VNode {
        const loginFields = html`
            <section>
                <big>
                    <section class="login__body">
                        ${h(LoginIDField, { loginIDField })} ${h(PasswordField, { passwordField })}
                    </section>
                </big>
            </section>
        `

        const loginFooter = html`
            <footer class="login__footer">
                <div class="button__container">
                    <div>
                        <big>${button}</big>
                    </div>
                    <div class="login__link">
                        <a href="${passwordLogin.link.passwordResetSession()}">
                            <i class="lnir lnir-question-circle"></i> パスワードがわからない方
                        </a>
                    </div>
                </div>
                ${footer}
            </footer>
        `

        return html`
            <aside class="login">
                <form class="login__box" onSubmit="${onSubmit}">
                    ${loginHeader()} ${loginFields} ${loginFooter}
                </form>
            </aside>
        `
    }

    switch (state.type) {
        case "initial-login":
            return view(onSubmit_login, loginButton(), html``)

        case "failed-to-login":
            return view(
                onSubmit_login,
                loginButton(),
                html` <aside>${formMessage("form_error", loginError(state.err))}</aside> `
            )

        case "try-to-login":
            return view(onSubmit_noop, loginButton_connecting(), html``)

        case "delayed-to-login":
            return view(
                onSubmit_noop,
                loginButton_connecting(),
                html`
                    <aside>
                        ${formMessage(
                            "form_warning",
                            html`
                                <p class="form__message">認証に時間がかかっています</p>
                                <p class="form__message">
                                    30秒以上かかるようであれば何かがおかしいので、お手数ですが管理者に連絡してください
                                </p>
                            `
                        )}
                    </aside>
                `
            )

        case "succeed-to-login":
            // スクリプトのロードは appendChild する必要があるため useEffect で行う
            return EMPTY_CONTENT

        case "storage-error":
        case "load-error":
            return h(ApplicationError, { err: state.err.err })

        case "error":
            return h(ApplicationError, { err: state.err })
    }

    function loginButton() {
        return html`<button ref="${submit}" class="button button_save">ログイン</button>`
    }
    function loginButton_connecting(): VNode {
        return html`
            <button type="button" class="button button_saving">
                ログインしています ${" "}
                <i class="lnir lnir-spinner lnir-is-spinning"></i>
            </button>
        `
    }

    function onSubmit_login(e: Event) {
        e.preventDefault()

        if (submit.current) {
            submit.current.blur()
        }

        passwordLogin.login()
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

const EMPTY_CONTENT = html``

interface Post<T> {
    (state: T): void
}
