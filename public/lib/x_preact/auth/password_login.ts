import { h, VNode } from "preact"
import { useState, useEffect, useRef } from "preact/hooks"
import { html } from "htm/preact"

import { loginHeader } from "../layout"

import { ApplicationError } from "../application_error"

import { LoginIDField } from "./password_login/field/login_id"
import { PasswordField } from "./password_login/field/password"

import { AppHref } from "../../href"

import {
    PasswordLoginComponent,
    initialPasswordLoginState,
    initialPasswordLoginRequest,
} from "../../auth/component/password_login/component"

import { LoginError } from "../../password_login/data"

type Props = Readonly<{
    component: PasswordLoginComponent
    href: AppHref
}>

export function PasswordLogin(props: Props): VNode {
    const [state, setState] = useState(initialPasswordLoginState)
    const [request, setRequest] = useState(() => initialPasswordLoginRequest)
    // submitter の focus を解除するために必要 : イベントから submitter が取得できるようになったら必要ない
    const submit = useRef<HTMLButtonElement>()
    useEffect(() => {
        props.component.onStateChange(setState)

        const resource = props.component.init()
        setRequest(() => resource.request)

        return resource.terminate
    }, [])

    function view(onSubmit: Post<Event>, button: VNode, footer: VNode): VNode {
        return html`
            <aside class="login">
                <form class="login__box" onSubmit="${onSubmit}">
                    ${loginHeader()}
                    <section>
                        <big>
                            <section class="login__body">
                                ${h(LoginIDField, { component: props.component, request })}
                                ${h(PasswordField, { component: props.component, request })}
                            </section>
                        </big>
                    </section>
                    <footer class="login__footer">
                        <div class="button__container">
                            <div>
                                <big>${button}</big>
                            </div>
                            <div class="login__link">
                                <a href="${props.href.auth.passwordResetSessionHref()}">
                                    <i class="lnir lnir-question-circle"></i> パスワードがわからない方
                                </a>
                            </div>
                        </div>
                        ${footer}
                    </footer>
                </form>
            </aside>
        `
    }

    switch (state.type) {
        case "initial-login":
            return view(onSubmit_login, loginButton(), html``)

        case "failed-to-login":
            return view(onSubmit_login, loginButton(), html`
                <aside>
                    ${formMessage("form_error", loginError(state.err))}
                </aside>
            `)

        case "try-to-login":
            return view(onSubmit_noop, loginButton_connecting(), html``)

        case "delayed-to-login":
            return view(onSubmit_noop, loginButton_connecting(), html`
                <aside>
                    ${formMessage("form_warning", html`
                        <p class="form__message">認証に時間がかかっています</p>
                        <p class="form__message">
                            30秒以上かかるようであれば何かがおかしいので、お手数ですが管理者に連絡してください
                        </p>
                    `)}
                </aside>
            `)

        case "succeed-to-login":
            return EMPTY_CONTENT

        case "error":
            return h(ApplicationError, { err: state.err })
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

        request({ type: "login" })
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
