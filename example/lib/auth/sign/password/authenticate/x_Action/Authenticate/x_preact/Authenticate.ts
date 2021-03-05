import { h, VNode } from "preact"
import { useLayoutEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../../../../../../z_vendor/getto-css/preact/common"
import { loginBox } from "../../../../../../../z_vendor/getto-css/preact/layout/login"
import {
    buttons,
    button_disabled,
    button_send,
    button_undo,
    fieldError,
    form,
} from "../../../../../../../z_vendor/getto-css/preact/design/form"

import { useApplicationAction, useEntryPoint } from "../../../../../../../x_preact/common/hooks"
import { siteInfo } from "../../../../../../../x_preact/common/site"
import { icon, spinner } from "../../../../../../../x_preact/common/icon"

import { appendScript } from "../../../../../../../x_preact/auth/Sign/script"

import { ApplicationError } from "../../../../../../../x_preact/common/System/ApplicationError"
import { InputLoginID } from "../../../../../common/fields/loginID/input/Action/x_preact/InputLoginID"
import { InputPassword } from "../../../../../common/fields/password/input/Action/x_preact/InputPassword"

import {
    AuthenticatePasswordEntryPoint,
    AuthenticatePasswordResource,
    AuthenticatePasswordResourceState,
} from "../action"

import { AuthenticateError } from "../../../data"

export function AuthenticatePassword(entryPoint: AuthenticatePasswordEntryPoint): VNode {
    const resource = useEntryPoint(entryPoint)
    return h(View, <AuthenticatePasswordProps>{
        ...resource,
        state: {
            core: useApplicationAction(resource.authenticate.core),
            form: useApplicationAction(resource.authenticate.form.validate),
        },
    })
}

export type AuthenticatePasswordProps = AuthenticatePasswordResource &
    Readonly<{ state: AuthenticatePasswordResourceState }>
export function View(props: AuthenticatePasswordProps): VNode {
    useLayoutEffect(() => {
        // スクリプトのロードは appendChild する必要があるため useLayoutEffect で行う
        switch (props.state.core.type) {
            case "try-to-load":
                if (!props.state.core.scriptPath.valid) {
                    props.authenticate.core.loadError({
                        type: "infra-error",
                        err: `スクリプトのロードに失敗しました: ${props.state.core.type}`,
                    })
                    break
                }
                appendScript(props.state.core.scriptPath.value, (script) => {
                    script.onerror = () => {
                        props.authenticate.core.loadError({
                            type: "infra-error",
                            err: `スクリプトのロードに失敗しました: ${props.state.core.type}`,
                        })
                    }
                })
                break
        }
    }, [props.state.core])

    switch (props.state.core.type) {
        case "initial-login":
            return authenticateForm({ state: "login" })

        case "failed-to-login":
            return authenticateForm({ state: "login", error: loginError(props.state.core.err) })

        case "try-to-login":
            return authenticateForm({ state: "connecting" })

        case "delayed-to-login":
            return delayedMessage()

        case "try-to-load":
            // スクリプトのロードは appendChild する必要があるため useLayoutEffect で行う
            return EMPTY_CONTENT

        case "repository-error":
        case "load-error":
            return h(ApplicationError, { err: props.state.core.err.err })
    }

    type AuthenticateFormState = "login" | "connecting"

    type AuthenticateFormContent =
        | AuthenticateFormContent_base
        | (AuthenticateFormContent_base & AuthenticateFormContent_error)

    type AuthenticateFormContent_base = Readonly<{ state: AuthenticateFormState }>
    type AuthenticateFormContent_error = Readonly<{ error: VNodeContent[] }>

    function authenticateTitle() {
        return "ログイン"
    }

    function authenticateForm(content: AuthenticateFormContent): VNode {
        return form(
            loginBox(siteInfo(), {
                title: authenticateTitle(),
                body: [
                    h(InputLoginID, { field: props.authenticate.form.loginID, help: [] }),
                    h(InputPassword, { field: props.authenticate.form.password, help: [] }),
                    buttons({ right: clearButton() }),
                ],
                footer: [buttons({ left: button(), right: resetLink() }), error()],
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
                props.authenticate.form.clear()
            }
        }

        function button() {
            switch (content.state) {
                case "login":
                    return loginButton()

                case "connecting":
                    return connectingButton()
            }

            function loginButton() {
                const label = "ログイン"

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
                    props.authenticate.core.submit(props.authenticate.form.validate.get())
                }
            }
            function connectingButton(): VNode {
                return button_send({
                    state: "connect",
                    label: html`ログインしています ${spinner}`,
                })
            }
        }

        function error() {
            if ("error" in content) {
                return fieldError(content.error)
            }

            switch (props.state.form) {
                case "initial":
                case "valid":
                    return ""

                case "invalid":
                    return fieldError(["正しく入力されていません"])
            }
        }
    }
    function delayedMessage() {
        return loginBox(siteInfo(), {
            title: authenticateTitle(),
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

    function resetLink() {
        return html`<a href="${props.href.password_reset_requestToken()}">
            ${icon("question-circle")} パスワードがわからない方
        </a>`
    }
}

function loginError(err: AuthenticateError): VNodeContent[] {
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

const EMPTY_CONTENT = html``
