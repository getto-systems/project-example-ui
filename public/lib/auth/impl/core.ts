import { packRenewCredentialParam } from "../component/renew_credential/param"

import { packResetToken } from "../../password_reset/adapter"

import { AuthUsecase, AuthComponent, AuthState } from "../usecase"
import { Infra } from "../infra"

import { AuthCredential } from "../../credential/data"

export function initAuthUsecase(infra: Infra, currentLocation: Location, component: AuthComponent): AuthUsecase {
    return new Usecase(infra, currentLocation, component)
}

class Usecase implements AuthUsecase {
    infra: Infra
    listener: Post<AuthState>[]

    component: AuthComponent

    currentLocation: Location

    constructor(infra: Infra, currentLocation: Location, component: AuthComponent) {
        this.infra = infra
        this.listener = []

        this.component = component

        this.currentLocation = currentLocation

        this.component.renewCredential.onStateChange((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.tryToLogin()
                    return

                case "succeed-to-renew":
                    this.storeCredential(state.authCredential)
                    return
            }
        })

        this.component.passwordLogin.onStateChange((state) => {
            switch (state.type) {
                case "succeed-to-login":
                    this.storeCredential(state.authCredential)
                    return
            }
        })

        this.component.passwordReset.onStateChange((state) => {
            switch (state.type) {
                case "succeed-to-reset":
                    this.storeCredential(state.authCredential)
                    return
            }
        })
    }

    onStateChange(stateChanged: Post<AuthState>): void {
        this.listener.push(stateChanged)
    }

    init(): void {
        const found = this.infra.authCredentials.findTicketNonce()
        if (!found.success) {
            this.post({ type: "failed-to-fetch", err: found.err })
            return
        }
        if (!found.found) {
            this.tryToLogin()
            return
        }

        this.post({ type: "renew-credential", param: packRenewCredentialParam(found.content) })
    }
    terminate(): void {
        // component とインターフェイスを合わせるために必要
    }

    post(state: AuthState): void {
        this.listener.forEach(post => post(state))
    }

    tryToLogin(): void {
        this.post(loginState(this.currentLocation))
    }

    storeCredential(authCredential: AuthCredential): void {
        const response = this.infra.authCredentials.storeAuthCredential(authCredential)
        if (!response.success) {
            this.post({ type: "failed-to-store", err: response.err })
            return
        }

        this.component.renewCredential.trigger({ type: "set-renew-interval", ticketNonce: authCredential.ticketNonce })

        this.post({ type: "load-application" })
    }
}

function loginState(currentLocation: Location): AuthState {
    // ログイン前画面ではアンダースコアから始まるクエリを使用する
    const url = new URL(currentLocation.toString())

    if (url.searchParams.get("_password_reset") === "start") {
        return { type: "password-reset-session" }
    }

    const resetToken = url.searchParams.get("_password_reset_token")
    if (resetToken) {
        return { type: "password-reset", resetToken: packResetToken(resetToken) }
    }

    // 特に指定が無ければパスワードログイン
    return { type: "password-login" }
}

interface Post<T> {
    (state: T): void
}
