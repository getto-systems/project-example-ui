import { render, h, VNode } from "preact"
import { useState } from "preact/hooks"
import { html } from "htm/preact"

import { init } from "../z_main/auth"
import { AuthUsecase } from "../auth"

import { Renew } from "./auth/renew"
import { LoadApplication } from "./auth/load_application"

import { PasswordLogin } from "./auth/password_login"

// TODO あとで削除
import Worker from "worker-loader!./app.worker"

const worker = new Worker()

worker.postMessage({ a: 1 })
worker.addEventListener("message", (event) => {
    console.log(event)
})

render(h(main(init(location, localStorage)), {}), document.body)

function main(usecase: AuthUsecase) {
    return (): VNode => {
        const [state, setState] = useState(usecase.initialState())
        usecase.onStateChange(setState)

        switch (state.type) {
            case "renew":
                return h(Renew(usecase.initRenew()), {})

            case "load-application":
                return h(LoadApplication(usecase.initLoadApplication()), {})

            case "password-login":
                return h(PasswordLogin(usecase.initPasswordLogin()), {})

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
