import { render, h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { FetchCredential } from "./auth/fetch_credential"
import { RenewCredential } from "./auth/renew_credential"
import { StoreCredential } from "./auth/store_credential"
import { LoadApplication } from "./auth/load_application"

import { PasswordLogin } from "./auth/password_login"

import { ComponentLoader } from "../z_main/auth"
import { newLoadApplicationComponent } from "../z_main/auth/worker/load_application"

import { initialAuthUsecaseState } from "../auth/data"

render(h(main(), {}), document.body)

function main() {
    const loader = new ComponentLoader()
    const [usecase, handler] = loader.initAuthUsecase()

    return (): VNode => {
        const [state, setState] = useState(initialAuthUsecaseState)
        useEffect(() => {
            usecase.init(setState)
            return () => usecase.terminate()
        })

        // TODO useErrorBoundary とか使ってエラーの処理をする

        switch (state.type) {
            case "fetch-credential":
                return h(FetchCredential(usecase.component.fetchCredential, usecase), {})

            case "renew-credential":
                return h(RenewCredential(usecase.component.renewCredential, state.ticketNonce, usecase), {})

            case "store-credential":
                return h(StoreCredential(usecase.component.storeCredential, state.authCredential, usecase), {})

            case "load-application":
                return h(LoadApplication(newLoadApplicationComponent()), {})

            case "password-login":
                return h(PasswordLogin(
                    loader.initPasswordLoginComponent(),
                    loader.initPasswordLoginComponentEvent(handler),
                ), {})

            case "password-reset-session":
                //return h(PasswordReset(...state.init), {})
                return html`ここでパスワードリセット！`

            case "password-reset":
                //return h(PasswordReset(...state.init), {})
                return html`ここでパスワードリセット！`
        }
    }
}
