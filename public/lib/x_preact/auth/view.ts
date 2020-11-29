import { h, VNode } from "preact"
import { useState, useEffect, useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useView } from "../container"
import { ApplicationError } from "../system/application_error"

import { RenewCredential } from "./renew_credential"

import { PasswordLogin } from "./password_login"
import { PasswordResetSession } from "./password_reset_session"
import { PasswordReset } from "./password_reset"

import { AuthViewFactory, AuthView, initialAuthState } from "../../auth/Auth/view"

type Props = Readonly<{
    factory: AuthViewFactory
}>
export function Main({ factory }: Props): VNode {
    const [err, _resetError] = useErrorBoundary((err) => {
        // ここでエラーをどこかに投げたい、けど認証前なのでこれでお茶を濁す
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    const container = useView(() => factory())

    if (!container.set) {
        return EMPTY_CONTENT
    }

    return h(View, container)
}

type ViewProps = Readonly<{
    view: AuthView
}>
function View({ view }: ViewProps): VNode {
    const [state, setState] = useState(initialAuthState)
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
