import { render, h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { ComponentLoader } from "../z_main/auth"
import { newLoadApplicationComponent } from "../z_main/auth/worker/load_application"

import { initialAuthComponentState } from "../auth/action"

import { Renew } from "./auth/renew"
import { LoadApplication } from "./auth/load_application"

import { PasswordLogin } from "./auth/password_login"

render(h(main(), {}), document.body)

function main() {
    const loader = new ComponentLoader()
    const [component, handler] = loader.initAuthComponent()

    return (): VNode => {
        const [state, setState] = useState(initialAuthComponentState)
        useEffect(() => {
            component.init(setState)
            return () => component.terminate()
        })

        switch (state.type) {
            case "renew":
                return h(Renew(
                    loader.initRenewComponent(),
                    loader.initRenewComponentEvent(handler),
                ), {})

            case "load-application":
            case "store-credential":
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
