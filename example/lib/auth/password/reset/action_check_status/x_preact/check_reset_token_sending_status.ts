import { h, VNode } from "preact"
import { html } from "htm/preact"

import {
    useApplicationAction,
    useApplicationView,
} from "../../../../../z_vendor/getto-application/action/x_preact/hooks"

import { buttons } from "../../../../../z_vendor/getto-css/preact/design/form"
import { loginBox } from "../../../../../z_vendor/getto-css/preact/layout/login"
import { v_medium } from "../../../../../z_vendor/getto-css/preact/design/alignment"

import { VNodeContent } from "../../../../../x_preact/common/design/common"
import { siteInfo } from "../../../../../x_preact/common/site"
import { spinner } from "../../../../../x_preact/common/design/icon"
import { signNav } from "../../../../common/nav/x_preact/nav"

import {
    CheckResetTokenSendingStatusView,
    CheckResetTokenSendingStatusResource,
    CheckResetTokenSendingStatusResourceState,
} from "../resource"

import {
    ResetTokenSendingStatus,
    CheckResetTokenSendingStatusError,
    SendResetTokenError,
} from "../../check_status/data"
import { remoteCommonError } from "../../../../../z_vendor/getto-application/infra/remote/helper"

export function CheckPasswordResetSendingStatusEntry(
    view: CheckResetTokenSendingStatusView,
): VNode {
    const resource = useApplicationView(view)
    return h(CheckPasswordResetSendingStatusComponent, {
        ...resource,
        state: useApplicationAction(resource.checkStatus),
    })
}

type Props = CheckResetTokenSendingStatusResource & CheckResetTokenSendingStatusResourceState
export function CheckPasswordResetSendingStatusComponent(props: Props): VNode {
    switch (props.state.type) {
        case "initial-check-status":
        case "try-to-check-status":
            return checkStatusMessage({ type: "initial" })

        case "retry-to-check-status":
            return checkStatusMessage({
                type: "retry",
                status: props.state.status,
            })

        case "succeed-to-send-token":
            return successMessage()

        case "failed-to-check-status":
            return errorMessage("ステータスの取得に失敗しました", checkStatusError(props.state.err))

        case "failed-to-send-token":
            return errorMessage(
                "リセットトークンの送信に失敗しました",
                sendTokenError(props.state.err),
            )
    }

    type CheckStatusContent =
        | Readonly<{ type: "initial" }>
        | Readonly<{ type: "retry"; status: ResetTokenSendingStatus }>

    function checkStatusMessage(content: CheckStatusContent): VNode {
        return loginBox(siteInfo(), {
            title: "リセットトークンを送信しています",
            body: message(),
            footer: footerLinks(),
        })

        function message() {
            switch (content.type) {
                case "initial":
                    return EMPTY_CONTENT

                case "retry":
                    return status(content.status)
            }
        }
    }
    function successMessage(): VNode {
        return loginBox(siteInfo(), {
            title: "リセットトークンを送信しました",
            body: sendTokenMessage(),
            footer: footerLinks(),
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

function status(status: ResetTokenSendingStatus): VNodeContent {
    if (!status.sending) {
        return html`<p>${spinner} トークン送信の準備をしています</p>`
    }
    return html`<p>${spinner} トークンを送信しています</p>`
}
function sendTokenMessage(): VNodeContent {
    return html`<p>送信しURLからパスワードのリセットができます</p>`
}

function checkStatusError(err: CheckResetTokenSendingStatusError): VNodeContent[] {
    switch (err.type) {
        case "empty-session-id":
            return ["パスワードリセットのためのセッションIDが取得できませんでした"]

        case "invalid-password-reset":
            return ["セッションエラーによりステータスの取得に失敗しました"]

        case "already-reset":
            return ["すでにリセット済みです"]

        case "bad-request":
        case "server-error":
        case "bad-response":
        case "infra-error":
            return remoteCommonError(
                err,
                (reason) => `${reason}によりステータスの取得に失敗しました`,
            )
    }
}
function sendTokenError(err: SendResetTokenError): VNodeContent[] {
    switch (err.type) {
        case "bad-request":
        case "server-error":
        case "bad-response":
        case "infra-error":
            return remoteCommonError(
                err,
                (reason) => `${reason}によりリセットトークンの送信に失敗しました`,
            )
    }
}

const EMPTY_CONTENT = html``
