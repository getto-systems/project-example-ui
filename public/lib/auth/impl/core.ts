import {
    AuthComponent,
    AuthComponentState,
    AuthComponentEvent,
    AuthComponentEventInit,
    AuthComponentStateHandler,
} from "../action"

import { AuthComponentError } from "../data"

export function initAuthComponent(currentLocation: Readonly<Location>): AuthComponent {
    return new Usecase(currentLocation)
}
export function initAuthComponentEvent(currentLocation: Readonly<Location>): AuthComponentEventInit {
    return (stateChanged) => new ComponentEvent(currentLocation, stateChanged)
}

class Usecase implements AuthComponent {
    currentLocation: Readonly<Location>

    initialState: AuthComponentState = { type: "renew" }

    constructor(currentLocation: Readonly<Location>) {
        this.currentLocation = currentLocation
    }
}

class ComponentEvent implements AuthComponentEvent {
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
