import { packRenewCredentialParam } from "../component/renew_credential/param"

import { packResetToken } from "../../password_reset/adapter"

import { AuthUsecase, AuthComponent, AuthState } from "../usecase"
import { Infra } from "../infra"

import { RenewCredentialParam } from "../component/renew_credential/component"

import { AuthCredential } from "../../credential/data"

export function initAuthUsecase(infra: Infra, currentLocation: Location, component: AuthComponent): AuthUsecase {
    return new Usecase(infra, currentLocation, component)
}

class Usecase implements AuthUsecase {
    infra: Infra

    holder: StateHolder
    component: AuthComponent

    currentLocation: Location

    constructor(infra: Infra, currentLocation: Location, component: AuthComponent) {
        this.infra = infra

        this.holder = { set: false, stack: false }
        this.component = component

        this.currentLocation = currentLocation

        this.component.renewCredential.hook((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.tryToLogin()
                    return

                case "succeed-to-store":
                    this.loadApplication()
                    return
            }
        })

        this.component.storeCredential.hook((state) => {
            switch (state.type) {
                case "succeed-to-store":
                    this.loadApplication()
                    return
            }
        })

        this.component.passwordLogin.hook((state) => {
            switch (state.type) {
                case "succeed-to-login":
                    this.storeCredential(state.authCredential)
                    return
            }
        })

        this.component.passwordReset.hook((state) => {
            switch (state.type) {
                case "succeed-to-reset":
                    this.storeCredential(state.authCredential)
                    return
            }
        })
    }

    onStateChange(post: Post<AuthState>): void {
        if (this.holder.stack) {
            post(this.holder.state)
        }
        this.holder = { set: true, stack: false, post }
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }

    async init(): Promise<void> {
        const found = this.infra.authCredentials.findTicketNonce()
        if (!found.success) {
            this.post({ type: "failed-to-fetch", err: found.err })
            return
        }
        if (!found.found) {
            this.tryToLogin()
            return
        }

        this.tryToRenew(packRenewCredentialParam(found.content))
    }

    post(state: AuthState): void {
        if (this.holder.set) {
            this.holder.post(state)
        } else {
            this.holder = { set: false, stack: true, state }
        }
    }

    async tryToRenew(param: RenewCredentialParam): Promise<void> {
        this.post({ type: "renew-credential", param })
    }
    async storeCredential(authCredential: AuthCredential): Promise<void> {
        this.post({ type: "store-credential", authCredential })
    }
    async tryToLogin(): Promise<void> {
        this.post(loginState(this.currentLocation))
    }
    async loadApplication(): Promise<void> {
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

type StateHolder =
    Readonly<{ set: false, stack: false }> |
    Readonly<{ set: false, stack: true, state: AuthState }> |
    Readonly<{ set: true, stack: false, post: Post<AuthState> }>

interface Post<T> {
    (state: T): void
}
