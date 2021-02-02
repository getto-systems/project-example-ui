import { h, VNode } from "preact"
import { html } from "htm/preact"

import { VNodeContent } from "../../../z_external/getto-css/preact/common"
import { buttons, button_send, fieldError, form } from "../../../z_external/getto-css/preact/design/form"
import { loginBox } from "../../../z_external/getto-css/preact/layout/login"
import { v_medium } from "../../../z_external/getto-css/preact/design/alignment"

import { useComponent } from "../../common/hooks"
import { siteInfo } from "../../common/site"
import { icon, spinner } from "../../common/icon"

import { ApplicationError } from "../../common/System/ApplicationError"

import { LoginIDField } from "./PasswordResetSession/LoginIDField"

import { PasswordResetSessionResource } from "../../../auth/Auth/Login/entryPoint"
import { initialPasswordResetSessionState } from "../../../auth/Auth/passwordResetSession/component"

import {
    Destination,
    SendingStatus,
    StartSessionError,
    CheckStatusError,
    SendTokenError,
} from "../../../auth/profile/passwordReset/data"

type Props = PasswordResetSessionResource
export function PasswordResetSession(resource: Props): VNode {
    const { passwordResetSession } = resource
    const state = useComponent(passwordResetSession, initialPasswordResetSessionState)

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

        case "error":
            return h(ApplicationError, { err: state.err })
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
                body: [h(LoginIDField, resource)],
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
                // TODO field に入力されて、すべて OK なら state: confirm にしたい
                return button_send({ state: "normal", label: "トークン送信", onClick })

                function onClick(e: Event) {
                    e.preventDefault()
                    passwordResetSession.startSession()
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
        | Readonly<{ type: "retry"; dest: Destination; status: SendingStatus }>

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
    function successMessage(dest: Destination): VNode {
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
        return html`<a href="${passwordResetSession.link.passwordLogin()}">
            ${icon("user")} ログインIDとパスワードでログインする
        </a>`
    }
}

function status(dest: Destination, status: SendingStatus): VNodeContent {
    if (!status.sending) {
        return html`<p>${spinner} トークン送信の準備をしています</p>`
    }
    switch (dest.type) {
        case "log":
            return html`<p>${spinner} トークンを送信しています</p>`
    }
}
function sendTokenMessage(dest: Destination): VNodeContent {
    switch (dest.type) {
        case "log":
            return html`<p>サーバーのログに記載されたリセットトークンを確認してください</p>`
    }
}

function startSessionError(err: StartSessionError): VNodeContent[] {
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
            return ["レスポンスエラーによりトークンの送信に失敗しました", `(詳細: ${err.err})`]

        case "infra-error":
            return ["ネットワークエラーによりトークンの送信に失敗しました", `(詳細: ${err.err})`]
    }
}
function checkStatusError(err: CheckStatusError): VNodeContent[] {
    switch (err.type) {
        case "bad-request":
            return ["アプリケーションエラーによりステータスの取得に失敗しました"]

        case "invalid-password-reset":
            return ["セッションエラーによりステータスの取得に失敗しました"]

        case "server-error":
            return ["サーバーエラーによりステータスの取得に失敗しました"]

        case "bad-response":
            return ["レスポンスエラーによりステータスの取得に失敗しました", `(詳細: ${err.err})`]

        case "infra-error":
            return ["ネットワークエラーによりステータスの取得に失敗しました", `(詳細: ${err.err})`]
    }
}
function sendTokenError(err: SendTokenError): VNodeContent[] {
    switch (err.type) {
        case "infra-error":
            return ["サーバーエラーによりリセットトークンの送信に失敗しました", `(詳細: ${err.err})`]
    }
}

const EMPTY_CONTENT = html``
