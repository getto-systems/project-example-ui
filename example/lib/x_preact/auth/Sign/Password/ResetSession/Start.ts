import { h, VNode } from "preact"
import { html } from "htm/preact"

import { VNodeContent } from "../../../../../z_vendor/getto-css/preact/common"
import {
    buttons,
    button_disabled,
    button_send,
    fieldError,
    form,
} from "../../../../../z_vendor/getto-css/preact/design/form"
import { loginBox } from "../../../../../z_vendor/getto-css/preact/layout/login"
import { v_medium } from "../../../../../z_vendor/getto-css/preact/design/alignment"

import { useAction, useTermination } from "../../../../common/hooks"
import { siteInfo } from "../../../../common/site"
import { icon, spinner } from "../../../../common/icon"

import { LoginIDFormField } from "../../field/loginID"

import { PasswordResetSessionEntryPoint } from "../../../../../auth/z_EntryPoint/Sign/entryPoint"

import { initialStartPasswordResetSessionState } from "../../../../../auth/sign/x_Action/Password/ResetSession/Start/Core/action"
import { initialFormContainerComponentState } from "../../../../../common/vendor/getto-form/x_Resource/Form/component"

import {
    PasswordResetDestination,
    PasswordResetSendingStatus,
    StartPasswordResetSessionError,
    CheckPasswordResetSessionStatusError,
    SendPasswordResetSessionTokenError,
} from "../../../../../auth/sign/password/resetSession/start/data"

export function PasswordResetSession({
    resource,
    terminate,
}: PasswordResetSessionEntryPoint): VNode {
    useTermination(terminate)

    const state = useAction(resource.start, initialStartPasswordResetSessionState)
    const formState = useAction(resource.form, initialFormContainerComponentState)

    switch (state.type) {
        case "initial-reset-session":
            return startSessionForm({ state: "start" })

        case "failed-to-start-session":
            return startSessionForm({ state: "start", error: startSessionError(state.err) })

        case "try-to-start-session":
            return startSessionForm({ state: "connecting" })

        case "delayed-to-start-session":
            return delayedMessage()

        case "try-to-check-status":
            return checkStatusMessage({ type: "initial" })

        case "retry-to-check-status":
            return checkStatusMessage({ type: "retry", dest: state.dest, status: state.status })

        case "succeed-to-send-token":
            return successMessage(state.dest)

        case "failed-to-check-status":
            return errorMessage("ステータスの取得に失敗しました", checkStatusError(state.err))

        case "failed-to-send-token":
            return errorMessage("リセットトークンの送信に失敗しました", sendTokenError(state.err))
    }

    type StartSessionFormState = "start" | "connecting"

    type StartSessionFormContent =
        | StartSessionFormContent_base
        | (StartSessionFormContent_base & StartSessionFormContent_error)
    type StartSessionFormContent_base = Readonly<{ state: StartSessionFormState }>
    type StartSessionFormContent_error = Readonly<{ error: VNodeContent[] }>

    function startSessionTitle() {
        return "パスワードリセット"
    }

    function startSessionForm(content: StartSessionFormContent): VNode {
        return form(
            loginBox(siteInfo(), {
                title: startSessionTitle(),
                body: [
                    h(LoginIDFormField, {
                        loginID: resource.form.loginID,
                        help: ["このログインIDに設定された送信先にリセットトークンを送信します"],
                    }),
                ],
                footer: [buttons({ left: button(), right: loginLink() }), error()],
            })
        )

        function button() {
            switch (content.state) {
                case "start":
                    return startSessionButton()

                case "connecting":
                    return connectingButton()
            }

            function startSessionButton() {
                const label = "トークン送信"

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
                    resource.start.submit(resource.form.getStartSessionFields())
                }
            }
            function connectingButton(): VNode {
                return button_send({
                    state: "connect",
                    label: html`トークンを送信しています ${spinner}`,
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
            title: startSessionTitle(),
            body: [
                html`<p>${spinner} トークンの送信に時間がかかっています</p>`,
                html`<p>
                    30秒以上かかる場合は何かがおかしいので、
                    <br />
                    お手数ですが管理者に連絡お願いします
                </p>`,
            ],
            footer: buttons({ right: loginLink() }),
        })
    }

    type CheckStatusContent =
        | Readonly<{ type: "initial" }>
        | Readonly<{
              type: "retry"
              dest: PasswordResetDestination
              status: PasswordResetSendingStatus
          }>

    function checkStatusMessage(content: CheckStatusContent): VNode {
        return loginBox(siteInfo(), {
            title: "リセットトークンを送信しています",
            body: message(),
            footer: buttons({ right: loginLink() }),
        })

        function message() {
            switch (content.type) {
                case "initial":
                    return EMPTY_CONTENT

                case "retry":
                    return status(content.dest, content.status)
            }
        }
    }
    function successMessage(dest: PasswordResetDestination): VNode {
        return loginBox(siteInfo(), {
            title: "リセットトークンを送信しました",
            body: sendTokenMessage(dest),
            footer: buttons({ right: loginLink() }),
        })
    }
    function errorMessage(title: VNodeContent, error: VNodeContent[]): VNode {
        return loginBox(siteInfo(), {
            title,
            body: [
                ...error.map((message) => html`<p>${message}</p>`),
                v_medium(),
                html`<p>お手数ですが、上記メッセージを管理者にお伝えください</p>`,
            ],
            footer: buttons({ right: loginLink() }),
        })
    }

    function loginLink(): VNode {
        return html`<a href="${resource.href.passwordLogin()}">
            ${icon("user")} ログインIDとパスワードでログインする
        </a>`
    }
}

function status(dest: PasswordResetDestination, status: PasswordResetSendingStatus): VNodeContent {
    if (!status.sending) {
        return html`<p>${spinner} トークン送信の準備をしています</p>`
    }
    switch (dest.type) {
        case "log":
            return html`<p>${spinner} トークンを送信しています</p>`
    }
}
function sendTokenMessage(dest: PasswordResetDestination): VNodeContent {
    switch (dest.type) {
        case "log":
            return html`<p>サーバーのログに記載されたリセットトークンを確認してください</p>`
    }
}

function startSessionError(err: StartPasswordResetSessionError): VNodeContent[] {
    switch (err.type) {
        case "validation-error":
            return ["正しく入力してください"]

        case "bad-request":
            return ["アプリケーションエラーによりトークンの送信に失敗しました"]

        case "invalid-password-reset":
            return ["ログインIDが登録されていないか、トークンの送信先が登録されていません"]

        case "server-error":
            return ["サーバーエラーによりトークンの送信に失敗しました"]

        case "bad-response":
            return ["レスポンスエラーによりトークンの送信に失敗しました", ...detail(err.err)]

        case "infra-error":
            return ["ネットワークエラーによりトークンの送信に失敗しました", ...detail(err.err)]
    }
}
function checkStatusError(err: CheckPasswordResetSessionStatusError): VNodeContent[] {
    switch (err.type) {
        case "bad-request":
            return ["アプリケーションエラーによりステータスの取得に失敗しました"]

        case "invalid-password-reset":
            return ["セッションエラーによりステータスの取得に失敗しました"]

        case "server-error":
            return ["サーバーエラーによりステータスの取得に失敗しました"]

        case "bad-response":
            return ["レスポンスエラーによりステータスの取得に失敗しました", ...detail(err.err)]

        case "infra-error":
            return ["ネットワークエラーによりステータスの取得に失敗しました", ...detail(err.err)]
    }
}
function sendTokenError(err: SendPasswordResetSessionTokenError): VNodeContent[] {
    switch (err.type) {
        case "infra-error":
            return ["サーバーエラーによりリセットトークンの送信に失敗しました", ...detail(err.err)]
    }
}

function detail(err: string): string[] {
    if (err.length === 0) {
        return []
    }
    return [`(詳細: ${err})`]
}

const EMPTY_CONTENT = html``
