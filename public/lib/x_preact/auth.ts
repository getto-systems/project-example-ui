import { render, h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { Fetch } from "./auth/fetch"
import { Renew } from "./auth/renew"
import { Store } from "./auth/store"
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
            case "fetch":
                return h(Fetch(usecase.component.fetch, (ticketNonce) => {
                    usecase.renew(ticketNonce)
                }), {})

            case "renew":
                return h(Renew(usecase.component.renew, state.ticketNonce, {
                    tryToLogin() {
                        usecase.tryToLogin()
                    },
                    loadApplication(authCredential) {
                        usecase.store(authCredential)
                    },
                }), {})

            case "store":
                return h(Store(usecase.component.store, state.authCredential, () => {
                    usecase.loadApplication()
                }), {})

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

            case "error":
                // TODO エラー画面を用意
                return html`なんかえらった！: ${state.err}`
        }
    }
}
