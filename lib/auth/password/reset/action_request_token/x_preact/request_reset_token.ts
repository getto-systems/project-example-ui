import { h, VNode } from "preact"
import { useLayoutEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    useApplicationAction,
    useApplicationView,
} from "../../../../../z_vendor/getto-application/action/x_preact/hooks"

import {
    buttons,
    button_disabled,
    button_send,
    button_undo,
    fieldError,
    form,
} from "../../../../../z_vendor/getto-css/preact/design/form"
import { loginBox } from "../../../../../z_vendor/getto-css/preact/layout/login"

import { VNodeContent } from "../../../../../x_preact/design/common"
import { siteInfo } from "../../../../../example/site"
import { spinner } from "../../../../../x_preact/design/icon"
import { signNav } from "../../../../common/nav/x_preact/nav"

import {
    RequestResetTokenView,
    RequestResetTokenResource,
    RequestResetTokenResourceState,
} from "../resource"

import { RequestResetTokenError } from "../../request_token/data"
import { InputLoginIDEntry } from "../../../../login_id/action_input/x_preact/input_login_id"
import { remoteCommonError } from "../../../../../z_vendor/getto-application/infra/remote/helper"

export function RequestResetTokenEntry(view: RequestResetTokenView): VNode {
    const resource = useApplicationView(view)
    return h(RequestResetTokenComponent, {
        ...resource,
        state: {
            core: useApplicationAction(resource.requestToken.core),
            form: useApplicationAction(resource.requestToken.form.validate),
        },
    })
}

type Props = RequestResetTokenResource & RequestResetTokenResourceState
export function RequestResetTokenComponent(props: Props): VNode {
    useLayoutEffect(() => {
        switch (props.state.core.type) {
            case "succeed-to-request-token":
                location.href = props.link.getHref_password_reset_checkStatus(
                    props.state.core.sessionID,
                )
                return
        }
    }, [props.link, props.state.core])

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

        case "take-longtime-to-request-token":
            return takeLongtimeMessage()

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
            loginBox(siteInfo, {
                title: startSessionTitle(),
                body: [
                    h(InputLoginIDEntry, {
                        field: props.requestToken.form.loginID,
                        help: ["このログインIDに設定された送信先にリセットトークンを送信します"],
                    }),
                    buttons({ left: button(), right: clearButton() }),
                ],
                footer: [footerLinks(), error()],
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
    function takeLongtimeMessage() {
        return loginBox(siteInfo, {
            title: startSessionTitle(),
            body: [
                html`<p>${spinner} トークンの送信に時間がかかっています</p>`,
                html`<p>
                    30秒以上かかる場合は何かがおかしいので、
                    <br />
                    お手数ですが管理者に連絡お願いします
                </p>`,
            ],
            footer: footerLinks(),
        })
    }

    function footerLinks() {
        return buttons({ left: privacyPolicyLink(), right: loginLink() })
    }
    function privacyPolicyLink() {
        return signNav(props.link.getNav_static_privacyPolicy())
    }
    function loginLink(): VNode {
        return signNav(props.link.getNav_password_authenticate())
    }
}

function requestTokenError(err: RequestResetTokenError): VNodeContent[] {
    switch (err.type) {
        case "validation-error":
            return ["正しく入力してください"]

        case "invalid-reset":
            return ["ログインIDが登録されていないか、トークンの送信先が登録されていません"]

        default:
            return remoteCommonError(err, (reason) => [
                `${reason.message}によりトークンの送信に失敗しました`,
                ...reason.detail,
            ])
    }
}

const EMPTY_CONTENT = html``
