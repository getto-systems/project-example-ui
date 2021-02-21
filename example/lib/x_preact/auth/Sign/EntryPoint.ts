import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useApplicationAction, useTermination_deprecated } from "../../common/hooks"

import { ApplicationError } from "../../common/System/ApplicationError"

import { RenewAuthInfo } from "../../../auth/sign/kernel/authnInfo/renew/x_Action/Renew/x_preact/Renew"

import { AuthenticatePassword } from "../../../auth/sign/password/authenticate/x_Action/Authenticate/x_preact/Authenticate"
import { PasswordResetSession } from "./Password/ResetSession/Start"
import { RegisterPassword } from "../../../auth/sign/password/resetSession/register/x_Action/Register/x_preact/Register"

import {
    AuthSignEntryPoint,
    initialAuthSignViewState,
} from "../../../x_main/public/auth/sign/entryPoint"

export function EntryPoint({ view, terminate }: AuthSignEntryPoint): VNode {
    useTermination_deprecated(terminate)

    const [err] = useErrorBoundary((err) => {
        // 認証前なのでエラーはどうしようもない
        console.log(err)
    })
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    const state = useApplicationAction(view, initialAuthSignViewState)

    switch (state.type) {
        case "initial-view":
            return EMPTY_CONTENT

        case "renew-credential":
            return h(RenewAuthInfo, state.entryPoint)

        case "password-login":
            return h(AuthenticatePassword, state.entryPoint)

        case "password-reset-session":
            return h(PasswordResetSession, state.entryPoint)

        case "password-reset":
            return h(RegisterPassword, state.entryPoint)

        case "error":
            return h(ApplicationError, { err: state.err })
    }
}

const EMPTY_CONTENT = html``
