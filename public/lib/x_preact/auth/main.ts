import { h, VNode } from "preact"
import { html } from "htm/preact"
import { useState, useEffect, useErrorBoundary } from "preact/hooks"

import { ApplicationError } from "./application_error"
import { ErrorView } from "./layout"

import { RenewCredential } from "./renew_credential"
import { StoreCredential } from "./store_credential"
import { LoadApplication } from "./load_application"

import { PasswordLogin } from "./password_login"
import { PasswordResetSession } from "./password_reset_session"
import { PasswordReset } from "./password_reset"

import { AuthUsecase, initialAuthState, FetchError, StoreError } from "../../auth/usecase"

export function Main(usecase: AuthUsecase) {
    return (): VNode => {
        const [error, _resetError] = useErrorBoundary((err) => {
            // ここでエラーをどこかに投げたい、けど認証前なのでこれでお茶を濁す
            console.log(err)
        })

        const [state, setState] = useState(initialAuthState)
        useEffect(() => {
            usecase.onStateChange(setState)
            usecase.init()
            return () => usecase.terminate()
        }, [])

        if (error) {
            return h(ApplicationError, {})
        }

        switch (state.type) {
            case "initial":
                return EMPTY_CONTENT

            case "renew-credential":
                return h(RenewCredential(usecase.component.renewCredential), { param: state.param })

            case "store-credential":
                return h(StoreCredential(usecase.component.storeCredential, state.authCredential), {})

            case "load-application":
                return h(LoadApplication(usecase.component.loadApplication), {})

            case "password-login":
                return h(PasswordLogin(usecase.component.passwordLogin), {})

            case "password-reset-session":
                return h(PasswordResetSession(usecase.component.passwordResetSession), {})

            case "password-reset":
                return h(PasswordReset(usecase.component.passwordReset, state.resetToken), {})

            case "failed-to-fetch":
            case "failed-to-store":
                return StorageError(state.err)
        }
    }
}

function StorageError(err: FetchError | StoreError): VNode {
    return ErrorView(
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
