import {
    AuthUsecase,
    AuthUsecaseEventHandler,
    AuthUsecaseState,
    AuthComponent,
    AuthEvent,
} from "../data"

import { AuthCredential, TicketNonce } from "../../credential/data"

export function initAuthUsecase(handler: AuthUsecaseEventHandler, component: AuthComponent): AuthUsecase {
    return new Usecase(handler, component)
}
export function initAuthUsecaseEventHandler(currentLocation: Readonly<Location>): AuthUsecaseEventHandler {
    return new UsecaseEventHandler(currentLocation)
}

class Usecase implements AuthUsecase {
    handler: AuthUsecaseEventHandler
    component: AuthComponent

    constructor(handler: AuthUsecaseEventHandler, component: AuthComponent) {
        this.handler = handler
        this.component = component
    }

    init(stateChanged: Publisher<AuthUsecaseState>): void {
        this.handler.onStateChange(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }

    async renew(ticketNonce: TicketNonce): Promise<void> {
        this.handler.handleAuthEvent({ type: "try-to-renew", ticketNonce })
    }
    async store(authCredential: AuthCredential): Promise<void> {
        this.handler.handleAuthEvent({ type: "try-to-store", authCredential })
    }
    async loadApplication(): Promise<void> {
        this.handler.handleAuthEvent({ type: "succeed-to-login" })
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
            case "try-to-renew":
                return { type: "renew", ticketNonce: event.ticketNonce }

            case "try-to-store":
                return { type: "store", authCredential: event.authCredential }

            case "try-to-login":
                return loginState(this.currentLocation)

            case "failed-to-login":
                return { type: "error", err: event.err }

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

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
