import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import {
    useApplicationAction,
    useApplicationEntryPoint,
} from "../../../z_vendor/getto-application/action/x_preact/hooks"

import { ApplicationErrorComponent } from "../../../common/x_preact/application_error"
import { CheckAuthInfo } from "../../sign/kernel/auth_info/action_check/x_preact/check_auth_info"
import { AuthenticatePassword } from "../../sign/password/view_authenticate/x_preact/authenticate_password"
import { RequestResetToken } from "../../sign/password/reset/view_request_token/x_preact/request_reset_token"
import { CheckPasswordResetSendingStatus } from "../../sign/password/reset/view_check_status/x_preact/check_reset_token_sending_status"
import { ResetPassword } from "../../sign/password/reset/view_reset/x_preact/reset_password"

import { SignEntryPoint, SignResource, SignResourceState } from "../entry_point"
import { PrivacyPolicyComponent } from "./privacy_policy"

export function Sign(entryPoint: SignEntryPoint): VNode {
    const resource = useApplicationEntryPoint(entryPoint)

    const [err] = useErrorBoundary((err) => {
        // 認証前なのでエラーはどうしようもない
        console.log(err)
    })
    if (err) {
        return h(ApplicationErrorComponent, { err: `${err}` })
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

        case "static-privacyPolicy":
            return h(PrivacyPolicyComponent, props.state.resource)

        case "check-authInfo":
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
            return h(ApplicationErrorComponent, { err: props.state.err })
    }
}

const EMPTY_CONTENT = html``
