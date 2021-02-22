import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useApplicationAction, useEntryPoint } from "../../../../../x_preact/common/hooks"

import { ApplicationError } from "../../../../../x_preact/common/System/ApplicationError"
import { RenewAuthInfo } from "../../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/x_preact/Renew"
import { AuthenticatePassword } from "../../../../../auth/sign/password/authenticate/x_Action/Authenticate/x_preact/Authenticate"
import { RequestPasswordResetToken } from "../../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/x_preact/RequestToken"
import { CheckPasswordResetSendingStatus } from "../../../../../auth/sign/password/reset/checkStatus/x_Action/CheckStatus/x_preact/CheckStatus"
import { ResetPassword } from "../../../../../auth/sign/password/reset/reset/x_Action/Reset/x_preact/Reset"

import {
    AuthSignEntryPoint,
    AuthSignResource,
    AuthSignActionState,
    initialAuthSignViewState,
} from "../entryPoint"

export function EntryPoint(entryPoint: AuthSignEntryPoint): VNode {
    const resource = useEntryPoint(entryPoint)

    const [err] = useErrorBoundary((err) => {
        // 認証前なのでエラーはどうしようもない
        console.log(err)
    })
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    return h(View, <AuthSignProps>{
        ...resource,
        state: useApplicationAction(resource.view, initialAuthSignViewState),
    })
}

export type AuthSignProps = AuthSignResource & Readonly<{ state: AuthSignActionState }>
export function View(props: AuthSignProps): VNode {
    switch (props.state.type) {
        case "initial-view":
            return EMPTY_CONTENT

        case "renew-credential":
            return h(RenewAuthInfo, props.state.entryPoint)

        case "password-authenticate":
            return h(AuthenticatePassword, props.state.entryPoint)

        case "password-reset-requestToken":
            return h(RequestPasswordResetToken, props.state.entryPoint)

        case "password-reset-checkStatus":
            return h(CheckPasswordResetSendingStatus, props.state.entryPoint)

        case "password-reset":
            return h(ResetPassword, props.state.entryPoint)

        case "error":
            return h(ApplicationError, { err: props.state.err })
    }
}

const EMPTY_CONTENT = html``
