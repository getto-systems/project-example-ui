import { h, VNode } from "preact"
import { useLayoutEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../../../../../../../z_vendor/getto-css/preact/common"
import {
    buttons,
    button_disabled,
    button_send,
    button_undo,
    fieldError,
} from "../../../../../../../../z_vendor/getto-css/preact/design/form"
import { loginBox } from "../../../../../../../../z_vendor/getto-css/preact/layout/login"

import { useApplicationAction, useEntryPoint } from "../../../../../../../../x_preact/common/hooks"
import { siteInfo } from "../../../../../../../../x_preact/common/site"
import { icon, spinner } from "../../../../../../../../x_preact/common/icon"

import { appendScript } from "../../../../../../../../x_preact/auth/Sign/script"

import { ApplicationError } from "../../../../../../../../x_preact/common/System/ApplicationError"
import { InputLoginID } from "../../../../../../common/loginID/board/Action/x_preact/LoginID"
import { InputPassword } from "../../../../../../common/password/board/Action/x_preact/Password"

import {
    ResetPasswordEntryPoint,
    ResetPasswordResource,
    ResetPasswordResourceState,
} from "../action"

import { ResetError } from "../../../data"

export function ResetPassword(entryPoint: ResetPasswordEntryPoint): VNode {
    const resource = useEntryPoint(entryPoint)
    return h(View, <ResetPasswordProps>{
        ...resource,
        state: {
            core: useApplicationAction(resource.reset.core),
            form: useApplicationAction(resource.reset.form.validate),
        },
    })
}

export type ResetPasswordProps = ResetPasswordResource &
    Readonly<{ state: ResetPasswordResourceState }>
export function View(props: ResetPasswordProps): VNode {
    useLayoutEffect(() => {
        // スクリプトのロードは appendChild する必要があるため useLayoutEffect で行う
        switch (props.state.core.type) {
            case "try-to-load":
                appendScript(props.state.core.scriptPath, (script) => {
                    script.onerror = () => {
                        props.reset.core.loadError({
                            type: "infra-error",
                            err: `スクリプトのロードに失敗しました: ${props.state.core.type}`,
                        })
                    }
                })
                break
        }
    }, [props.state.core])

    switch (props.state.core.type) {
        case "initial-reset":
            return resetForm({ state: "reset" })

        case "failed-to-reset":
            return resetForm({ state: "reset", error: resetError(props.state.core.err) })

        case "try-to-reset":
            return resetForm({ state: "connecting" })

        case "delayed-to-reset":
            return delayedMessage()

        case "try-to-load":
            // スクリプトのロードは appendChild する必要があるため useLayoutEffect で行う
            return EMPTY_CONTENT

        case "repository-error":
        case "load-error":
            return h(ApplicationError, { err: props.state.core.err.err })
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
                    h(InputLoginID, {
                        field: props.reset.form.loginID,
                        help: ["最初に入力したログインIDを入力してください"],
                    }),
                    h(InputPassword, {
                        field: props.reset.form.password,
                        help: ["新しいパスワードを入力してください"],
                    }),
                    buttons({ right: clearButton() }),
                ],
                footer: [buttons({ left: button(), right: sendLink() }), error()],
            }),
        )

        function clearButton() {
            const label = "入力内容をクリア"
            switch (props.state.form) {
                case "initial":
                    return button_disabled({ label })

                case "invalid":
                case "valid":
                    return button_undo({ label, onClick })
            }

            function onClick(e: Event) {
                e.preventDefault()
                props.reset.form.clear()
            }
        }

        function button() {
            switch (content.state) {
                case "reset":
                    return resetButton()

                case "connecting":
                    return connectingButton()
            }

            function resetButton() {
                const label = "パスワードリセット"

                switch (props.state.form) {
                    case "initial":
                        return button_send({ state: "normal", label, onClick })

                    case "valid":
                        return button_send({ state: "confirm", label, onClick })

                    case "invalid":
                        return button_disabled({ label })
                }

                function onClick(e: Event) {
                    e.preventDefault()
                    props.reset.core.submit(props.reset.form.validate.get())
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
        return html`<a href="${props.href.password_reset()}">
            ${icon("question-circle")} リセットトークンをもう一度送信する
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
