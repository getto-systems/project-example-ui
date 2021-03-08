import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import {
    useApplicationAction,
    useApplicationEntryPoint,
} from "../../../z_vendor/getto-application/action/x_preact/hooks"

import { ApplicationError } from "../../../common/x_preact/ApplicationError"
import { CheckAuthInfo } from "../../sign/kernel/auth_info/action_check/x_preact/CheckAuthInfo"
import { AuthenticatePassword } from "../../sign/password/view_authenticate/x_preact/Authenticate"
import { RequestResetToken } from "../../sign/password/reset/view_request_token/x_preact/RequestResetToken"
import { CheckPasswordResetSendingStatus } from "../../sign/password/reset/view_check_status/x_preact/CheckResetTokenSendingStatus"
import { ResetPassword } from "../../sign/password/reset/view_reset/x_preact/ResetPassword"

import { SignEntryPoint, SignResource, SignResourceState } from "../entry_point"

export function SignView(entryPoint: SignEntryPoint): VNode {
    const resource = useApplicationEntryPoint(entryPoint)

    const [err] = useErrorBoundary((err) => {
        // 認証前なのでエラーはどうしようもない
        console.log(err)
    })
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    return h(SignComponent, {
        state: useApplicationAction(resource.view),
        ...resource,
    })
}

export type SignProps = SignResource & SignResourceState
export function SignComponent(props: SignProps): VNode {
    switch (props.state.type) {
        case "initial-view":
            return EMPTY_CONTENT

        case "renew-credential":
            return h(CheckAuthInfo, props.state.entryPoint)

        case "password-authenticate":
            return h(AuthenticatePassword, props.state.entryPoint)

        case "password-reset-requestToken":
            return h(RequestResetToken, props.state.entryPoint)

        case "password-reset-checkStatus":
            return h(CheckPasswordResetSendingStatus, props.state.entryPoint)

        case "password-reset":
            return h(ResetPassword, props.state.entryPoint)

        case "error":
            return h(ApplicationError, { err: props.state.err })
    }
}

const EMPTY_CONTENT = html``