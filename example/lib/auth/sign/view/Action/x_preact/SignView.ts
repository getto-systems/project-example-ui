import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useApplicationAction, useEntryPoint } from "../../../../../x_preact/common/hooks"

import { ApplicationError } from "../../../../../x_preact/common/System/ApplicationError"
import { CheckAuthInfo } from "../../../kernel/authInfo/check/Action/x_preact/CheckAuthInfo"
import { AuthenticatePassword } from "../../../password/authenticate/Action/x_preact/Authenticate"
import { RequestResetToken } from "../../../password/reset/requestToken/Action/x_preact/RequestResetToken"
import { CheckPasswordResetSendingStatus } from "../../../password/reset/checkStatus/x_Action/CheckStatus/x_preact/CheckStatus"
import { ResetPassword } from "../../../password/reset/reset/x_Action/Reset/x_preact/Reset"

import { SignEntryPoint, SignResource, SignResourceState } from "../entryPoint"

export function SignView(entryPoint: SignEntryPoint): VNode {
    const resource = useEntryPoint(entryPoint)

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
