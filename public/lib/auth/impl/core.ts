import {
    AuthComponent,
    AuthComponentEventHandler,
    AuthEvent,
    AuthComponentState,
} from "../data"

export function initAuthComponent(handler: AuthComponentEventHandler): AuthComponent {
    return new Component(handler)
}
export function initAuthComponentEventHandler(currentLocation: Readonly<Location>): AuthComponentEventHandler {
    return new ComponentEventHandler(currentLocation)
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
