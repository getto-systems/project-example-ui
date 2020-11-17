import { h, VNode } from "preact"
import { useState, useEffect, useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useView } from "../container"
import { ApplicationError } from "../system/application_error"

import { RenewCredential } from "./renew_credential"

import { PasswordLogin } from "./password_login"
import { PasswordResetSession } from "./password_reset_session"
import { PasswordReset } from "./password_reset"

import { AuthViewFactory, AuthView, initialAuthState } from "../../auth/view"

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

    const container = useView(() => factory(location))

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
            return h(RenewCredential, { factory: view.components.renewCredential })

        case "password-login":
            return h(PasswordLogin, { factory: view.components.passwordLogin })

        case "password-reset-session":
            return h(PasswordResetSession, { factory: view.components.passwordResetSession })

        case "password-reset":
            return h(PasswordReset, { factory: view.components.passwordReset })

        case "error":
            return h(ApplicationError, { err: state.err })
    }
}

const EMPTY_CONTENT = html``
