import {
    AuthComponent,
    AuthComponentEventHandler,
    AuthEvent,
    AuthComponentDeprecated,
    AuthComponentState,
    AuthComponentEventPublisher,
    AuthComponentEventInit,
    AuthComponentStateHandler,
} from "../action"

import { AuthComponentError } from "../data"

export function initAuthComponent(handler: AuthComponentEventHandler): AuthComponent {
    return new Component(handler)
}
export function initAuthComponentEventHandler(currentLocation: Readonly<Location>): AuthComponentEventHandler {
    return new ComponentEventHandler(currentLocation)
}
export function initAuthComponentDeprecated(currentLocation: Readonly<Location>): AuthComponentDeprecated {
    return new UsecaseDeprecated(currentLocation)
}
export function initAuthComponentEvent(currentLocation: Readonly<Location>): AuthComponentEventInit {
    return (stateChanged) => new ComponentEvent(currentLocation, stateChanged)
}

class Component implements AuthComponent {
    handler: AuthComponentEventHandler

    constructor(handler: AuthComponentEventHandler) {
        this.handler = handler
    }

    init(stateChanged: Publisher<AuthComponentState>): void {
        this.handler.onStateChange(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
}

class ComponentEventHandler implements AuthComponentEventHandler {
    holder: PublisherHolder<AuthComponentState>

    currentLocation: Readonly<Location>

    constructor(currentLocation: Readonly<Location>) {
        this.holder = { set: false }

        this.currentLocation = currentLocation
    }

    onStateChange(pub: Publisher<AuthComponentState>): void {
        this.holder = { set: true, pub }
    }

    handleAuthEvent(event: AuthEvent): void {
        this.publish(this.map(event))
    }
    map(event: AuthEvent): AuthComponentState {
        switch (event.type) {
            case "try-to-login":
                return loginState(this.currentLocation)

            case "failed-to-login":
                return { type: "error", err: event.err }

            case "try-to-store-credential":
                return { type: "store-credential" }

            case "succeed-to-login":
                return { type: "load-application" }
        }
    }

    publish(state: AuthComponentState): void {
        if (this.holder.set) {
            this.holder.pub(state)
        }
    }
}

function loginState(currentLocation: Readonly<Location>): AuthComponentState {
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

class UsecaseDeprecated implements AuthComponentDeprecated {
    currentLocation: Readonly<Location>

    initialState: AuthComponentState = { type: "renew" }

    constructor(currentLocation: Readonly<Location>) {
        this.currentLocation = currentLocation
    }
}

class ComponentEvent implements AuthComponentEventPublisher {
    currentLocation: Readonly<Location>
    stateChanged: AuthComponentStateHandler

    constructor(currentLocation: Readonly<Location>, stateChanged: AuthComponentStateHandler) {
        this.currentLocation = currentLocation
        this.stateChanged = stateChanged
    }

    tryToLogin(): void {
        // ログイン前画面ではアンダースコアで始まる query string を使用する
        const url = new URL(this.currentLocation.toString())
        if (url.searchParams.get("_password_reset_session")) {
            this.stateChanged({ type: "password-reset-session" })
            return
        }

        const resetToken = url.searchParams.get("_password_reset_token")
        if (resetToken) {
            this.stateChanged({ type: "password-reset", resetToken: { resetToken } })
            return
        }

        // 特に指定が無ければパスワードログイン
        this.stateChanged({ type: "password-login" })
    }
    failedToAuth(err: AuthComponentError): void {
        this.stateChanged({ type: "error", err })
    }
    succeedToAuth(): void {
        this.stateChanged({ type: "load-application" })
    }
}
