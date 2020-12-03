import { h, VNode } from "preact"
import { useState, useEffect, useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useView } from "../../hooks"
import { ApplicationError } from "../../System/ApplicationError"

import { RenewCredential } from "./RenewCredential"

import { PasswordLogin } from "./PasswordLogin"
import { PasswordResetSession } from "./PasswordResetSession"
import { PasswordReset } from "./PasswordReset"

import { LoginFactory, LoginView, initialLoginState } from "../../../auth/login/Login/View/view"

type Props = Readonly<{
    login: LoginFactory
}>
export function Login({ login }: Props): VNode {
    const [err, _resetError] = useErrorBoundary((err) => {
        // ここでエラーをどこかに投げたい、けど認証前なのでこれでお茶を濁す
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    const container = useView(() => login())

    if (!container.set) {
        return EMPTY_CONTENT
    }

    return h(View, container)
}

type ViewProps = Readonly<{
    view: LoginView
}>
function View({ view }: ViewProps): VNode {
    const [state, setState] = useState(initialLoginState)
    useEffect(() => {
        view.onStateChange(setState)
        view.load()
    }, [])

    switch (state.type) {
        case "initial":
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
