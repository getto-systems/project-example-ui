import { h, VNode } from "preact"
import { useState, useEffect, useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { ApplicationError } from "../application_error"

import { Credential } from "./credential"
import { Application } from "./application"

import { PasswordLogin } from "./password_login"
import { PasswordResetSession } from "./password_reset_session"
import { PasswordReset } from "./password_reset"

import { AuthUsecase, initialAuthState } from "../../auth/usecase"

type Props = Readonly<{
    usecase: AuthUsecase
}>

export function Main(props: Props): VNode {
    const [err, _resetError] = useErrorBoundary((err) => {
        // ここでエラーをどこかに投げたい、けど認証前なのでこれでお茶を濁す
        // worker の catch でもエラー通知を入れたい
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    const [state, setState] = useState(initialAuthState)
    useEffect(() => {
        props.usecase.onStateChange(setState)

        const resource = props.usecase.init()
        resource.request({ type: "renew" })

        return resource.terminate
    }, [])

    switch (state.type) {
        case "initial":
            return EMPTY_CONTENT

        case "credential":
            return h(Credential, {
                component: props.usecase.component.credential,
                param: state.param,
            })

        case "application":
            return h(Application, {
                component: props.usecase.component.application,
                param: state.param,
            })

        case "password-login":
            return h(PasswordLogin, {
                usecase: props.usecase,
                view: {
                    passwordLogin: props.usecase.component.passwordLogin,
                },
            })

        case "password-reset-session":
            return h(PasswordResetSession, {
                component: props.usecase.component.passwordResetSession,
                href: props.usecase.href,
            })

        case "password-reset":
            return h(PasswordReset, {
                component: props.usecase.component.passwordReset,
                href: props.usecase.href,
                param: state.param,
            })

        case "error":
            return h(ApplicationError, { err: state.err })
    }
}

const EMPTY_CONTENT = html``
