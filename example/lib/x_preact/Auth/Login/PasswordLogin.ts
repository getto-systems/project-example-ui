import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../../z_external/getto-css/preact/common"
import { loginBox } from "../../../z_external/getto-css/preact/layout/login"
import { buttons, button_send, fieldError } from "../../../z_external/getto-css/preact/design/form"

import { useComponent } from "../../common/hooks"
import { siteInfo } from "../../common/site"
import { icon, spinner } from "../../common/icon"

import { appendScript } from "./script"

import { ApplicationError } from "../../common/System/ApplicationError"

import { LoginIDField } from "./PasswordLogin/LoginIDField"
import { PasswordField } from "./PasswordLogin/PasswordField"

import { PasswordLoginResource } from "../../../auth/Auth/Login/view"
import { initialPasswordLoginState } from "../../../auth/Auth/passwordLogin/component"

import { LoginError } from "../../../auth/login/passwordLogin/data"

type Props = Readonly<{
    resource: PasswordLoginResource
}>
export function PasswordLogin({
    resource: { passwordLogin, loginIDField, passwordField },
}: Props): VNode {
    const state = useComponent(passwordLogin, initialPasswordLoginState)

    useEffect(() => {
        // スクリプトのロードは appendChild する必要があるため useEffect で行う
        switch (state.type) {
            case "try-to-load":
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

    switch (state.type) {
        case "initial-login":
            return loginForm({ button: loginButton() })

        case "failed-to-login":
            return loginForm({ button: loginButton(), error: loginError(state.err) })

        case "try-to-login":
            return loginForm({ button: loginButton_connecting() })

        case "delayed-to-login":
            return delayedMessage()

        case "try-to-load":
            // スクリプトのロードは appendChild する必要があるため useEffect で行う
            return EMPTY_CONTENT

        case "storage-error":
        case "load-error":
            return h(ApplicationError, { err: state.err.err })

        case "error":
            return h(ApplicationError, { err: state.err })
    }

    type LoginFormContent = LoginFormContent_base | (LoginFormContent_base & LoginFormContent_error)
    type LoginFormContent_base = Readonly<{ button: VNode }>
    type LoginFormContent_error = Readonly<{ error: VNodeContent[] }>

    function loginForm(content: LoginFormContent): VNode {
        return loginBox(siteInfo(), {
            title: loginTitle(),
            body: form([h(LoginIDField, { loginIDField }), h(PasswordField, { passwordField })]),
            footer: [
                buttons({
                    left: content.button,
                    right: resetLink(),
                }),
                error(),
            ],
        })

        function error() {
            if ("error" in content) {
                return fieldError(content.error)
            }
            return ""
        }
    }
    function delayedMessage() {
        return loginBox(siteInfo(), {
            title: loginTitle(),
            body: [
                html`<p>${spinner} 認証中です</p>`,
                html`<p>
                    30秒以上かかる場合は何かがおかしいので、
                    <br />
                    お手数ですが管理者に連絡お願いします
                </p>`,
            ],
            footer: buttons({ right: resetLink() }),
        })
    }

    function loginTitle() {
        return "ログイン"
    }

    function resetLink() {
        return html`<a href="${passwordLogin.link.passwordResetSession()}">
            ${icon("question-circle")} パスワードがわからない方
        </a>`
    }

    function loginButton() {
        // TODO field に入力されて、すべて OK なら state: confirm にしたい
        return button_send({ state: "normal", label: "ログイン", onClick })

        function onClick(e: Event) {
            e.preventDefault()
            passwordLogin.login()
        }
    }
    function loginButton_connecting(): VNode {
        return button_send({ state: "connect", label: html`ログインしています ${spinner}` })
    }
}

function loginError(err: LoginError): VNodeContent[] {
    switch (err.type) {
        case "validation-error":
            return ["正しく入力してください"]

        case "bad-request":
            return ["アプリケーションエラーにより認証に失敗しました"]

        case "invalid-password-login":
            return ["ログインIDかパスワードが違います"]

        case "server-error":
            return ["サーバーエラーにより認証に失敗しました"]

        case "bad-response":
            return ["レスポンスエラーにより認証に失敗しました", `(詳細: ${err.err})`]

        case "infra-error":
            return ["ネットワークエラーにより認証に失敗しました", `(詳細: ${err.err})`]
    }
}

function form(content: VNodeContent) {
    return html`<form>${content}</form>`
}

const EMPTY_CONTENT = html``
