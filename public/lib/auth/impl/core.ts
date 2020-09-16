import {
    AuthUsecase,
    AuthUsecaseState,
    AuthComponent,
    AuthUsecaseEventHandler,
    AuthEvent,
} from "../data"

import { AuthCredential, TicketNonce } from "../../credential/data"

export function initAuthUsecase(currentLocation: Readonly<Location>, component: AuthComponent): AuthUsecase {
    return new Usecase(currentLocation, component)
}
export function initAuthUsecaseEventHandler(currentLocation: Readonly<Location>): AuthUsecaseEventHandler {
    return new UsecaseEventHandler(currentLocation)
}

class Usecase implements AuthUsecase {
    holder: UsecasePublisherHolder
    component: AuthComponent

    currentLocation: Readonly<Location>

    constructor(currentLocation: Readonly<Location>, component: AuthComponent) {
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

class UsecaseEventHandler implements AuthUsecaseEventHandler {
    holder: PublisherHolder<AuthUsecaseState>

    currentLocation: Readonly<Location>

    constructor(currentLocation: Readonly<Location>) {
        this.holder = { set: false }

        this.currentLocation = currentLocation
    }

    onStateChange(pub: Publisher<AuthUsecaseState>): void {
        this.holder = { set: true, pub }
    }

    handleAuthEvent(event: AuthEvent): void {
        this.publish(this.map(event))
    }
    map(event: AuthEvent): AuthUsecaseState {
        switch (event.type) {
            case "try-to-renew-credential":
                return { type: "renew-credential", ticketNonce: event.ticketNonce }

            case "try-to-store-credential":
                return { type: "store-credential", authCredential: event.authCredential }

            case "try-to-login":
                return loginState(this.currentLocation)

            case "succeed-to-login":
                return { type: "load-application" }
        }
    }

    publish(state: AuthUsecaseState): void {
        if (this.holder.set) {
            this.holder.pub(state)
        }
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

function loginState(currentLocation: Readonly<Location>): AuthUsecaseState {
    // ログイン前画面ではハッシュ部分を使用して画面の切り替えを行う
    const url = new URL(currentLocation.toString())

    if (url.hash === "password-reset-session") {
        return { type: "password-reset-session" }
    }

    if (url.hash.startsWith("password-reset-")) {
        return { type: "password-reset", resetToken: { resetToken: url.hash.replace(/^password-reset-/, "") } }
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
