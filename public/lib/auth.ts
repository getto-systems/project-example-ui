import { AuthAction, AuthEvent, AuthError } from "./auth/action"

import { RenewComponent, initRenew } from "./auth/renew"
import { LoadApplicationComponent, initLoadApplication } from "./auth/load_application"

import { PasswordLoginComponent, initPasswordLogin } from "./auth/password_login"
import { PasswordResetSessionComponent, initPasswordResetSession } from "./auth/password_reset_session"
import { PasswordResetComponent, initPasswordReset } from "./auth/password_reset"

import { ResetToken } from "./password_reset/data"

export interface AuthUsecase {
    initialState: AuthState
    onStateChange(stateChanged: AuthEventHandler): void

    initRenew(): RenewComponent
    initLoadApplication(): LoadApplicationComponent

    initPasswordLogin(): PasswordLoginComponent
    initPasswordResetSession(): PasswordResetSessionComponent
    initPasswordReset(resetToken: ResetToken): PasswordResetComponent
}

export type AuthState =
    Readonly<{ type: "renew" }> |
    Readonly<{ type: "load-application" }> |
    Readonly<{ type: "password-login" }> |
    Readonly<{ type: "password-reset-session" }> |
    Readonly<{ type: "password-reset", resetToken: ResetToken }> |
    Readonly<{ type: "error", err: AuthError }>

export interface AuthEventHandler {
    (state: AuthState): void
}

export function initAuthUsecase(currentLocation: Readonly<Location>, action: AuthAction): AuthUsecase {
    return new Usecase(currentLocation, action)
}

class Usecase implements AuthUsecase {
    currentLocation: Readonly<Location>
    action: AuthAction

    eventHolder: EventHolder<UsecaseEvent>

    initialState: AuthState = { type: "renew" }

    constructor(currentLocation: Readonly<Location>, action: AuthAction) {
        this.currentLocation = currentLocation
        this.action = action
        this.eventHolder = { hasEvent: false }
    }

    onStateChange(stateChanged: AuthEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new UsecaseEvent(stateChanged, this.currentLocation) }
    }
    event(): AuthEvent {
        return unwrap(this.eventHolder)
    }

    initRenew(): RenewComponent {
        return initRenew(this.action, this.event())
    }
    initLoadApplication(): LoadApplicationComponent {
        return initLoadApplication(this.action, this.event())
    }

    initPasswordLogin(): PasswordLoginComponent {
        return initPasswordLogin(this.action, this.event())
    }
    initPasswordResetSession(): PasswordResetSessionComponent {
        return initPasswordResetSession(this.action)
    }
    initPasswordReset(resetToken: ResetToken): PasswordResetComponent {
        return initPasswordReset(this.action, this.event(), resetToken)
    }
}

class UsecaseEvent implements AuthEvent {
    stateChanged: AuthEventHandler
    currentLocation: Readonly<Location>

    constructor(stateChanged: AuthEventHandler, currentLocation: Readonly<Location>) {
        this.stateChanged = stateChanged
        this.currentLocation = currentLocation
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
    failedToAuth(err: AuthError): void {
        this.stateChanged({ type: "error", err })
    }
    succeedToAuth(): void {
        this.stateChanged({ type: "load-application" })
    }
}

type EventHolder<T> =
    Readonly<{ hasEvent: false }> |
    Readonly<{ hasEvent: true, event: T }>
function unwrap<T>(holder: EventHolder<T>): T {
    if (!holder.hasEvent) {
        throw new Error("event is not initialized")
    }
    return holder.event
}
