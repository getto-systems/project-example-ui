import { h, VNode } from "preact"
import { useState, useEffect, useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { ApplicationError } from "../application_error"

import { Credential } from "./credential"

import { PasswordLogin } from "./password_login"
import { PasswordResetSession } from "./password_reset_session"
import { PasswordReset } from "./password_reset"

import { AuthInit, AuthView, initialAuthState } from "../../auth/view"

type Props = Readonly<{
    init: AuthInit
}>

export function Main({ init }: Props): VNode {
    const [err, _resetError] = useErrorBoundary((err) => {
        // ここでエラーをどこかに投げたい、けど認証前なのでこれでお茶を濁す
        // TODO worker の catch でもエラー通知を入れたい
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    const [container, setView] = useState<Container>({ set: false })
    useEffect(() => {
        const resource = init(location)
        setView({ set: true, view: resource.view })
        return resource.terminate
    }, [])

    if (!container.set) {
        return EMPTY_CONTENT
    }

    return h(View, { view: container.view })
}

type Container =
    Readonly<{ set: false }> |
    Readonly<{ set: true, view: AuthView }>

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

        case "credential":
            return h(Credential, { init: view.components.credential })

        case "password-login":
            return h(PasswordLogin, { init: view.components.passwordLogin })

        case "password-reset-session":
            return h(PasswordResetSession, { init: view.components.passwordResetSession })

        case "password-reset":
            return h(PasswordReset, { init: view.components.passwordReset })

        case "error":
            return h(ApplicationError, { err: state.err })
    }
}

const EMPTY_CONTENT = html``
