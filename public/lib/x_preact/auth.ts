import { render, h, VNode } from "preact"
import { useState } from "preact/hooks"
import { html } from "htm/preact"

import { ComponentLoader } from "../z_main/auth"
import { newLoadApplicationComponent } from "../z_main/auth/worker/load_application"

import { Renew } from "./auth/renew"
import { LoadApplication } from "./auth/load_application"

import { PasswordLogin } from "./auth/password_login"

render(h(main(), {}), document.body)

function main() {
    const loader = new ComponentLoader()
    const [component, initEvent] = loader.initAuthComponent()

    return (): VNode => {
        const [state, setState] = useState(component.initialState)
        const event = initEvent(setState)

        switch (state.type) {
            case "renew":
                return h(Renew(
                    loader.initRenewComponent(),
                    loader.initRenewComponentEvent(event),
                ), {})

            case "load-application":
                return h(LoadApplication(newLoadApplicationComponent()), {})

            case "password-login":
                return h(PasswordLogin(
                    loader.initPasswordLoginComponent(),
                    loader.initPasswordLoginComponentEvent(event),
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
