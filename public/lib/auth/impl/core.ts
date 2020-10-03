import { packResetToken } from "../../password_reset/adapter"
import { packPagePathname } from "../../application/adapter"

import { AppHref } from "../../href"
import {
    AuthUsecase,
    AuthUsecaseResource,
    AuthParam,
    AuthState,
    AuthOperation,
    AuthComponent,
    AuthAction,
    PasswordLoginView,
} from "../usecase"

import { BackgroundCredentialComponent } from "../../background/credential/component"

import { PagePathname } from "../../application/data"

type Init = Readonly<{
    currentLocation: Location
    href: AppHref
    param: AuthParam
    component: AuthComponent
    background: Background
    action: AuthAction
}>

export function initAuthUsecase(init: Init): AuthUsecase {
    return new Usecase(init)
}

type Background = Readonly<{
    credential: BackgroundCredentialComponent
}>

class Usecase implements AuthUsecase {
    currentLocation: Location

    href: AppHref
    param: AuthParam
    component: AuthComponent
    background: Background
    action: AuthAction

    listener: Post<AuthState>[] = []

    constructor(init: Init) {
        this.currentLocation = init.currentLocation
        this.href = init.href
        this.param = init.param
        this.component = init.component
        this.background = init.background
        this.action = init.action

        this.component.credential.onStateChange((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.post(this.detectLoginState())
                    return
            }
        })

        this.component.passwordLogin.onStateChange((state) => {
            switch (state.type) {
                case "succeed-to-login":
                    this.post({
                        type: "application",
                        param: this.param.application({
                            pagePathname: this.currentPagePathname(),
                        }),
                    })
                    return
            }
        })

        this.component.passwordReset.onStateChange((state) => {
            switch (state.type) {
                case "succeed-to-reset":
                    this.post({
                        type: "application",
                        param: this.param.application({
                            pagePathname: this.currentPagePathname(),
                        }),
                    })
                    return
            }
        })

        this.background.credential.sub.onStoreEvent((event) => {
            switch (event.type) {
                case "failed-to-store":
                    this.post({ type: "error", err: event.err.err })
                    return
            }
        })
    }

    onStateChange(stateChanged: Post<AuthState>): void {
        this.listener.push(stateChanged)
    }

    post(state: AuthState): void {
        this.listener.forEach(post => post(state))
    }

    init(): AuthUsecaseResource {
        return {
            request: operation => this.request(operation),
            terminate: () => { /* component とインターフェイスを合わせるために必要 */ },
        }
    }
    request(_operation: AuthOperation) {
        const fetchResponse = this.background.credential.fetch()
        if (!fetchResponse.success) {
            this.post({ type: "error", err: fetchResponse.err.err })
            return
        }
        if (!fetchResponse.found) {
            this.post(this.detectLoginState())
            return
        }

        this.post({
            type: "credential",
            param: this.param.credential({
                pagePathname: this.currentPagePathname(),
                lastAuth: fetchResponse.content
            }),
        })
    }

    initPasswordLogin(view: PasswordLoginView): Terminate {
        // TODO terminator でまとめたい
        const passwordLogin = this.action.passwordLogin()

        const action = passwordLogin((subscriber) => {
            view.passwordLogin.subscribePasswordLogin(subscriber)
        })

        view.passwordLogin.setRequest({
            passwordLogin: action.request,
        })

        return () => {
            action.terminate()
        }
    }

    detectLoginState(): AuthState {
        // ログイン前画面ではアンダースコアから始まるクエリを使用する
        const url = new URL(this.currentLocation.toString())

        if (url.searchParams.get("_password_reset") === "start") {
            return { type: "password-reset-session" }
        }

        const resetToken = url.searchParams.get("_password_reset_token")
        if (resetToken) {
            return { type: "password-reset", param: this.param.passwordReset(packResetToken(resetToken)) }
        }

        // 特に指定が無ければパスワードログイン
        return { type: "password-login" }
    }

    currentPagePathname(): PagePathname {
        return packPagePathname(new URL(this.currentLocation.toString()))
    }
}

interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}
