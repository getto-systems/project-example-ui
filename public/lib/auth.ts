import { AuthAction, AuthEvent, AuthError } from "./auth/action"

import { initRenew } from "./auth/renew/impl/core"
import { initLoadApplication } from "./auth/load_application/impl/core"
import { initLoginIDField } from "./auth/field/login_id/impl/core"
import { initPasswordField } from "./auth/field/password/impl/core"
import { initPasswordLogin } from "./auth/password_login/impl/core"
import { initPasswordReset } from "./auth/password_reset/impl/core"
import { initPasswordResetSession } from "./auth/password_reset_session/impl/core"

import { RenewComponent } from "./auth/renew/action"
import { LoadApplicationComponent } from "./auth/load_application/action"

import { PasswordLoginComponent } from "./auth/password_login/action"
import { PasswordResetSessionComponent } from "./auth/password_reset_session/action"
import { PasswordResetComponent } from "./auth/password_reset/action"

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
        const loginID = initLoginIDField(this.action)
        const password = initPasswordField(this.action)
        return initPasswordLogin(loginID, password, this.action, this.event())
    }
    initPasswordResetSession(): PasswordResetSessionComponent {
        const loginID = initLoginIDField(this.action)
        return initPasswordResetSession(loginID, this.action)
    }
    initPasswordReset(resetToken: ResetToken): PasswordResetComponent {
        const loginID = initLoginIDField(this.action)
        const password = initPasswordField(this.action)
        return initPasswordReset(loginID, password, this.action, this.event(), resetToken)
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
