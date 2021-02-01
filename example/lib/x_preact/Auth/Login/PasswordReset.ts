import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../../z_external/getto-css/preact/common"
import { buttons, button_send, fieldError } from "../../../z_external/getto-css/preact/design/form"
import { loginBox } from "../../../z_external/getto-css/preact/layout/login"

import { useComponent } from "../../common/hooks"
import { siteInfo } from "../../common/site"
import { icon, spinner } from "../../common/icon"

import { appendScript } from "./script"

import { ApplicationError } from "../../common/System/ApplicationError"

import { LoginIDField } from "./PasswordReset/LoginIDField"
import { PasswordField } from "./PasswordReset/PasswordField"

import { PasswordResetResource } from "../../../auth/Auth/Login/view"
import { initialPasswordResetState } from "../../../auth/Auth/passwordReset/component"

import { ResetError } from "../../../auth/profile/passwordReset/data"

type Props = Readonly<{
    resource: PasswordResetResource
}>
export function PasswordReset({
    resource: { passwordReset, loginIDField, passwordField },
}: Props): VNode {
    const state = useComponent(passwordReset, initialPasswordResetState)

    useEffect(() => {
        // スクリプトのロードは appendChild する必要があるため useEffect で行う
        switch (state.type) {
            case "try-to-load":
                appendScript(state.scriptPath, (script) => {
                    script.onerror = () => {
                        passwordReset.loadError({
                            type: "infra-error",
                            err: `スクリプトのロードに失敗しました: ${state.type}`,
                        })
                    }
                })
                break
        }
    }, [state])

    switch (state.type) {
        case "initial-reset":
            return resetForm({ button: resetButton() })

        case "failed-to-reset":
            return resetForm({ button: resetButton(), error: resetError(state.err) })

        case "try-to-reset":
            return resetForm({ button: resetButton_connecting() })

        case "delayed-to-reset":
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

    type ResetFormContent = ResetFormContent_base | (ResetFormContent_base & ResetFormContent_error)
    type ResetFormContent_base = Readonly<{ button: VNode }>
    type ResetFormContent_error = Readonly<{ error: VNodeContent[] }>

    function resetForm(content: ResetFormContent): VNode {
        return loginBox(siteInfo(), {
            title: resetTitle(),
            body: form([h(LoginIDField, { loginIDField }), h(PasswordField, { passwordField })]),
            footer: [
                buttons({
                    left: content.button,
                    right: sendLink(),
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
            title: resetTitle(),
            body: [
                html`<p>${spinner} リセットに時間がかかっています</p>`,
                html`<p>
                    30秒以上かかる場合は何かがおかしいので、
                    <br />
                    お手数ですが管理者に連絡お願いします
                </p>`,
            ],
            footer: buttons({ right: sendLink() }),
        })
    }

    function resetTitle() {
        return "パスワードリセット"
    }

    function sendLink() {
        return html`<a href="${passwordReset.link.passwordResetSession()}">
            ${icon("question-circle")} パスワードがわからない方
        </a>`
    }

    function resetButton() {
        // TODO field に入力されて、すべて OK なら state: confirm にしたい
        return button_send({ state: "normal", label: "パスワードリセット", onClick })

        function onClick(e: Event) {
            e.preventDefault()
            passwordReset.reset()
        }
    }
    function resetButton_connecting(): VNode {
        return button_send({ state: "connect", label: html`パスワードをリセットしています ${spinner}` })
    }
}

function resetError(err: ResetError): VNodeContent[] {
    switch (err.type) {
        case "validation-error":
            return ["正しく入力してください"]

        case "empty-reset-token":
            return ["リセットトークンが見つかりませんでした"]

        case "bad-request":
            return ["アプリケーションエラーにより認証に失敗しました"]

        case "invalid-password-reset":
            return ["ログインIDが最初に入力したものと違います"]

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
