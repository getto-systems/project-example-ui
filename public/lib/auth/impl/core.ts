import { packResetToken } from "../../password_reset/adapter"
import { packPagePathname } from "../../script/adapter"

import { AppHref } from "../../href"
import { AuthUsecase, AuthParam, AuthComponent, AuthState } from "../usecase"

import { StoreCredentialComponent } from "../../background/store_credential/component"

import { PagePathname } from "../../script/data"

type Init = Readonly<{
    currentLocation: Location
    href: AppHref
    param: AuthParam
    component: AuthComponent
    background: Background
}>

export function initAuthUsecase(init: Init): AuthUsecase {
    return new Usecase(init)
}

type Background = Readonly<{
    storeCredential: StoreCredentialComponent
}>

class Usecase implements AuthUsecase {
    currentLocation: Location

    href: AppHref
    param: AuthParam
    component: AuthComponent
    background: Background

    listener: Post<AuthState>[] = []

    constructor(init: Init) {
        this.currentLocation = init.currentLocation
        this.href = init.href
        this.param = init.param
        this.component = init.component
        this.background = init.background

        this.component.renewCredential.onStateChange((state) => {
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
                        type: "load-application",
                        param: this.param.loadApplication({
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
                        type: "load-application",
                        param: this.param.loadApplication({
                            pagePathname: this.currentPagePathname(),
                        }),
                    })
                    return
            }
        })

        this.background.storeCredential.sub.onStoreEvent((event) => {
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

    init(): Terminate {
        this.initUsecase()
        return () => { /* component とインターフェイスを合わせるために必要 */ }
    }
    initUsecase(): void {
        const fetchResponse = this.background.storeCredential.fetch()
        if (!fetchResponse.success) {
            this.post({ type: "error", err: fetchResponse.err.err })
            return
        }
        if (!fetchResponse.found) {
            this.post(this.detectLoginState())
            return
        }

        this.post({
            type: "renew-credential",
            param: this.param.renewCredential({
                pagePathname: this.currentPagePathname(),
                authResource: fetchResponse.content
            }),
        })
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
