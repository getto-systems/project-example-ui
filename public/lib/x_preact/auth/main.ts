import { h, VNode } from "preact"
import { html } from "htm/preact"
import { useState, useEffect, useErrorBoundary } from "preact/hooks"

import { loginError } from "../layout"
import { ApplicationError } from "../application_error"

import { RenewCredential } from "./renew_credential"
import { LoadApplication } from "./load_application"

import { PasswordLogin } from "./password_login"
import { PasswordResetSession } from "./password_reset_session"
import { PasswordReset } from "./password_reset"

import { AuthUsecase, initialAuthState, FetchError, StoreError } from "../../auth/usecase"

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
        return props.usecase.init()
    }, [])

    switch (state.type) {
        case "initial":
            return EMPTY_CONTENT

        case "renew-credential":
            return h(RenewCredential, {
                component: props.usecase.component.renewCredential,
                param: state.param,
            })

        case "load-application":
            return h(LoadApplication, {
                component: props.usecase.component.loadApplication,
                param: state.param,
            })

        case "password-login":
            return h(PasswordLogin, {
                component: props.usecase.component.passwordLogin,
                href: props.usecase.href,
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

        case "failed-to-fetch":
        case "failed-to-store":
            return StorageError(state.err)
    }
}

function StorageError(err: FetchError | StoreError): VNode {
    return loginError(
        html`アプリケーションの初期化に失敗しました`,
        html`
            <p>ブラウザが LocalStorage にアクセスできませんでした</p>
            <p>(詳細: ${err.err})</p>
            <div class="vertical vertical_medium"></div>
            <p>お手数ですが、上記メッセージを管理者に伝えてください</p>
        `,
        html``,
    )
}

const EMPTY_CONTENT: VNode = html``
