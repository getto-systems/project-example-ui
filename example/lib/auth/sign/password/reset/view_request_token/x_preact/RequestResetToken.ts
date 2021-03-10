import { h, VNode } from "preact"
import { useLayoutEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    useApplicationAction,
    useApplicationEntryPoint,
} from "../../../../../../z_vendor/getto-application/action/x_preact/hooks"

import {
    buttons,
    button_disabled,
    button_send,
    button_undo,
    fieldError,
    form,
} from "../../../../../../z_vendor/getto-css/preact/design/form"
import { loginBox } from "../../../../../../z_vendor/getto-css/preact/layout/login"

import { VNodeContent } from "../../../../../../common/x_preact/design/common"
import { siteInfo } from "../../../../../../common/x_preact/site"
import { icon, spinner } from "../../../../../../common/x_preact/design/icon"

import {
    RequestResetTokenEntryPoint,
    RequestResetTokenResource,
    RequestResetTokenResourceState,
} from "../entry_point"

import { RequestResetTokenError } from "../../request_token/data"
import { InputLoginID } from "../../../../common/fields/login_id/action_input/x_preact/InputLoginID"

export function RequestResetToken(entryPoint: RequestResetTokenEntryPoint): VNode {
    const resource = useApplicationEntryPoint(entryPoint)
    return h(RequestResetTokenComponent, {
        ...resource,
        state: {
            core: useApplicationAction(resource.requestToken.core),
            form: useApplicationAction(resource.requestToken.form.validate),
        },
    })
}

export type RequestResetTokenProps = RequestResetTokenResource & RequestResetTokenResourceState
export function RequestResetTokenComponent(props: RequestResetTokenProps): VNode {
    useLayoutEffect(() => {
        switch (props.state.core.type) {
            case "succeed-to-request-token":
                location.href = props.href.password_reset_checkStatus(props.state.core.sessionID)
                return
        }
    }, [props.state.core])

    switch (props.state.core.type) {
        case "initial-request-token":
            return startSessionForm({ state: "start" })

        case "failed-to-request-token":
            return startSessionForm({
                state: "start",
                error: requestTokenError(props.state.core.err),
            })

        case "try-to-request-token":
            return startSessionForm({ state: "connecting" })

        case "delayed-to-request-token":
            return delayedMessage()

        case "succeed-to-request-token":
            // useLayoutEffect で check status にリダイレクトする
            return EMPTY_CONTENT
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
                    h(InputLoginID, {
                        field: props.requestToken.form.loginID,
                        help: ["このログインIDに設定された送信先にリセットトークンを送信します"],
                    }),
                    buttons({ right: clearButton() }),
                ],
                footer: [buttons({ left: button(), right: loginLink() }), error()],
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
                props.requestToken.form.clear()
            }
        }

        function button() {
            switch (content.state) {
                case "start":
                    return startSessionButton()

                case "connecting":
                    return connectingButton()
            }

            function startSessionButton() {
                const label = "トークン送信"

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
                    props.requestToken.core.submit(props.requestToken.form.validate.get())
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

    function loginLink(): VNode {
        return html`<a href="${props.href.password_authenticate()}">
            ${icon("user")} ログインIDとパスワードでログインする
        </a>`
    }
}

function requestTokenError(err: RequestResetTokenError): VNodeContent[] {
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

function detail(err: string): string[] {
    if (err.length === 0) {
        return []
    }
    return [`(詳細: ${err})`]
}

const EMPTY_CONTENT = html``
