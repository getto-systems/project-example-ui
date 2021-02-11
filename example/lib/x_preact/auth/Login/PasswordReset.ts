import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../../z_vendor/getto-css/preact/common"
import {
    buttons,
    button_disabled,
    button_send,
    fieldError,
} from "../../../z_vendor/getto-css/preact/design/form"
import { loginBox } from "../../../z_vendor/getto-css/preact/layout/login"

import { useComponent } from "../../z_common/hooks"
import { siteInfo } from "../../z_common/site"
import { icon, spinner } from "../../z_common/icon"

import { appendScript } from "./script"

import { ApplicationError } from "../../z_common/System/ApplicationError"

import { LoginIDFormField } from "./field/loginID"
import { PasswordFormField } from "./field/password"

import { PasswordResetResource } from "../../../auth/x_components/Login/passwordReset/resource"

import { initialPasswordResetComponentState } from "../../../auth/x_components/Login/passwordReset/component"
import { initialFormComponentState } from "../../../sub/getto-form/x_components/Form/component"

import { ResetError } from "../../../auth/profile/passwordReset/data"

type Props = PasswordResetResource
export function PasswordReset(resource: Props): VNode {
    const { reset } = resource
    const state = useComponent(reset, initialPasswordResetComponentState)
    const formState = useComponent(resource.form, initialFormComponentState)

    useEffect(() => {
        // スクリプトのロードは appendChild する必要があるため useEffect で行う
        switch (state.type) {
            case "try-to-load":
                appendScript(state.scriptPath, (script) => {
                    script.onerror = () => {
                        reset.loadError({
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
            return resetForm({ state: "reset" })

        case "failed-to-reset":
            return resetForm({ state: "reset", error: resetError(state.err) })

        case "try-to-reset":
            return resetForm({ state: "connecting" })

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

    type ResetFormState = "reset" | "connecting"

    type ResetFormContent = ResetFormContent_base | (ResetFormContent_base & ResetFormContent_error)
    type ResetFormContent_base = Readonly<{ state: ResetFormState }>
    type ResetFormContent_error = Readonly<{ error: VNodeContent[] }>

    function resetTitle() {
        return "パスワードリセット"
    }

    function resetForm(content: ResetFormContent): VNode {
        return form(
            loginBox(siteInfo(), {
                title: resetTitle(),
                body: [
                    h(LoginIDFormField, {
                        loginID: resource.form.loginID,
                        help: ["最初に入力したログインIDを入力してください"],
                    }),
                    h(PasswordFormField, {
                        password: resource.form.password,
                        help: ["新しいパスワードを入力してください"],
                    }),
                ],
                footer: [buttons({ left: button(), right: sendLink() }), error()],
            })
        )

        function button() {
            switch (content.state) {
                case "reset":
                    return resetButton()

                case "connecting":
                    return connectingButton()
            }

            function resetButton() {
                const label = "パスワードリセット"

                switch (formState.validation) {
                    case "initial":
                        return button_send({ state: "normal", label, onClick })

                    case "valid":
                        return button_send({ state: "confirm", label, onClick })

                    case "invalid":
                        return button_disabled({ label })
                }

                function onClick(e: Event) {
                    e.preventDefault()
                    reset.reset(resource.form.getResetFields())
                }
            }
            function connectingButton(): VNode {
                return button_send({
                    state: "connect",
                    label: html`パスワードをリセットしています ${spinner}`,
                })
            }
        }

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

    function sendLink() {
        return html`<a href="${reset.link.passwordResetSession()}">
            ${icon("question-circle")} パスワードがわからない方
        </a>`
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
            return ["レスポンスエラーにより認証に失敗しました", ...detail(err.err)]

        case "infra-error":
            return ["ネットワークエラーにより認証に失敗しました", ...detail(err.err)]
    }
}

function detail(err: string): string[] {
    if (err.length === 0) {
        return []
    }
    return [`(詳細: ${err})`]
}

function form(content: VNodeContent) {
    return html`<form>${content}</form>`
}

const EMPTY_CONTENT = html``
