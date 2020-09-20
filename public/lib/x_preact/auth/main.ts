import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { FetchCredential } from "./fetch_credential"
import { RenewCredential } from "./renew_credential"
import { StoreCredential } from "./store_credential"
import { LoadApplication } from "./load_application"

import { PasswordLogin } from "./password_login"

import { AuthUsecase } from "../../auth/component"
import { initialAuthUsecaseState } from "../../auth/data"

export function Main(usecase: AuthUsecase) {
    return (): VNode => {
        const [state, setState] = useState(initialAuthUsecaseState)
        useEffect(() => {
            usecase.init(setState)
            return () => usecase.terminate()
        }, [])

        // TODO useErrorBoundary とか使ってエラーの処理をする

        switch (state.type) {
            case "fetch-credential":
                return h(FetchCredential(usecase.component.fetchCredential), {})

            case "renew-credential":
                return h(RenewCredential(usecase.component.renewCredential, state.ticketNonce), {})

            case "store-credential":
                return h(StoreCredential(usecase.component.storeCredential, state.authCredential), {})

            case "load-application":
                return h(LoadApplication(usecase.component.loadApplication), {})

            case "password-login":
                return h(PasswordLogin(usecase.component.passwordLogin), {})

            case "password-reset-session":
                //return h(PasswordReset(...state.init), {})
                return html`ここでパスワードリセット！`

            case "password-reset":
                //return h(PasswordReset(...state.init), {})
                return html`ここでパスワードリセット！`
        }
    }
}
