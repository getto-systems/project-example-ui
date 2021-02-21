import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useApplicationAction, useEntryPoint } from "../../../../../x_preact/common/hooks"

import { ApplicationError } from "../../../../../x_preact/common/System/ApplicationError"

import { RenewAuthInfo } from "../../../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/x_preact/Renew"

import { AuthenticatePassword } from "../../../../../auth/sign/password/authenticate/x_Action/Authenticate/x_preact/Authenticate"
import { PasswordResetSession } from "../../../../../auth/sign/password/resetSession/start/x_Action/Start/x_preact/Start"
import { RegisterPassword } from "../../../../../auth/sign/password/resetSession/register/x_Action/Register/x_preact/Register"

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

        case "password-login":
            return h(AuthenticatePassword, props.state.entryPoint)

        case "password-reset-session":
            return h(PasswordResetSession, props.state.entryPoint)

        case "password-reset":
            return h(RegisterPassword, props.state.entryPoint)

        case "error":
            return h(ApplicationError, { err: props.state.err })
    }
}

const EMPTY_CONTENT = html``
