import { initResetToken } from "../password_reset/adapter"

import { AuthUsecase, AuthComponent } from "./component"

import { AuthUsecaseState } from "./data"

import { AuthCredential, TicketNonce } from "../credential/data"

export function initAuthUsecase(currentLocation: Location, component: AuthComponent): AuthUsecase {
    return new Usecase(currentLocation, component)
}

class Usecase implements AuthUsecase {
    holder: UsecasePublisherHolder
    component: AuthComponent

    currentLocation: Location

    constructor(currentLocation: Location, component: AuthComponent) {
        this.holder = { set: false, stack: false }
        this.component = component

        this.currentLocation = currentLocation

        this.component.fetchCredential.hook((state) => {
            switch (state.type) {
                case "unauthorized":
                    this.tryToLogin()
                    return

                case "succeed-to-fetch":
                    this.renewCredential(state.ticketNonce)
                    return
            }
        })

        this.component.renewCredential.hook((state) => {
            switch (state.type) {
                case "unauthorized":
                    this.tryToLogin()
                    return

                case "succeed-to-renew":
                    this.storeCredential(state.authCredential)
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

    init(pub: Publisher<AuthUsecaseState>): void {
        if (this.holder.stack) {
            pub(this.holder.state)
        }
        this.holder = { set: true, stack: false, pub }
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }

    publish(state: AuthUsecaseState): void {
        if (this.holder.set) {
            this.holder.pub(state)
        } else {
            this.holder = { set: false, stack: true, state }
        }
    }

    async renewCredential(ticketNonce: TicketNonce): Promise<void> {
        this.publish({ type: "renew-credential", ticketNonce })
    }
    async storeCredential(authCredential: AuthCredential): Promise<void> {
        this.publish({ type: "store-credential", authCredential })
    }
    async tryToLogin(): Promise<void> {
        this.publish(loginState(this.currentLocation))
    }
    async loadApplication(): Promise<void> {
        this.publish({ type: "load-application" })
    }
}

function loginState(currentLocation: Location): AuthUsecaseState {
    // ログイン前画面ではアンダースコアから始まるクエリを使用する
    const url = new URL(currentLocation.toString())

    if (url.searchParams.get("_password_reset") !== null) {
        return { type: "password-reset-session" }
    }

    const resetToken = url.searchParams.get("_password_reset_token")
    if (resetToken) {
        return { type: "password-reset", resetToken: initResetToken(resetToken) }
    }

    // 特に指定が無ければパスワードログイン
    return { type: "password-login" }
}

type UsecasePublisherHolder =
    Readonly<{ set: false, stack: false }> |
    Readonly<{ set: false, stack: true, state: AuthUsecaseState }> |
    Readonly<{ set: true, stack: false, pub: Publisher<AuthUsecaseState> }>

interface Publisher<T> {
    (state: T): void
}
