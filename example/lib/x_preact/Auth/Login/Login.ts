import { h, VNode } from "preact"
import { useEffect, useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useComponent, useTerminate } from "../../common/hooks"

import { ApplicationError } from "../../common/System/ApplicationError"

import { RenewCredential } from "./RenewCredential"

import { PasswordLogin } from "./PasswordLogin"
import { PasswordResetSession } from "./PasswordResetSession"
import { PasswordReset } from "./PasswordReset"

import { LoginEntryPoint, initialLoginState } from "../../../auth/Auth/Login/view"

type Props = Readonly<{
    login: LoginEntryPoint
}>
export function Login({ login: { view, terminate } }: Props): VNode {
    const [err] = useErrorBoundary((err) => {
        // 認証前なのでエラーはどうしようもない
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    useTerminate(terminate)

    const state = useComponent(view, initialLoginState)
    useEffect(() => {
        view.load()
    }, [])

    switch (state.type) {
        case "initial-view":
            return EMPTY_CONTENT

        case "renew-credential":
            return h(RenewCredential, state)

        case "password-login":
            return h(PasswordLogin, state)

        case "password-reset-session":
            return h(PasswordResetSession, state)

        case "password-reset":
            return h(PasswordReset, state)

        case "error":
            return h(ApplicationError, { err: state.err })
    }
}

const EMPTY_CONTENT = html``
