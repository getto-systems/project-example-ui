import { AuthAction, AuthEvent, AuthError } from "./auth/action"

import { initRenewComponent, initRenewComponentEvent } from "./auth/renew/impl/core"
import { initLoadApplicationComponent, initLoadApplicationComponentEvent } from "./auth/load_application/impl/core"
import { initLoginIDFieldComponent, initLoginIDFieldComponentEvent } from "./auth/field/login_id/impl/core"
import { initPasswordFieldComponent, initPasswordFieldComponentEvent } from "./auth/field/password/impl/core"
import { initPasswordLoginComponent, initPasswordLoginComponentEvent } from "./auth/password_login/impl/core"
import { initPasswordResetComponent, initPasswordResetComponentEvent } from "./auth/password_reset/impl/core"
import { initPasswordResetSessionComponent, initPasswordResetSessionComponentEvent } from "./auth/password_reset_session/impl/core"

import { RenewComponent, RenewComponentEventInit } from "./auth/renew/action"
import { LoadApplicationComponent, LoadApplicationComponentEventInit } from "./auth/load_application/action"

import { PasswordLoginComponent, PasswordLoginComponentEventInit } from "./auth/password_login/action"
import { PasswordResetSessionComponent, PasswordResetSessionComponentEventInit } from "./auth/password_reset_session/action"
import { PasswordResetComponent, PasswordResetComponentEventInit } from "./auth/password_reset/action"

import { ResetToken } from "./password_reset/data"

export interface AuthUsecase {
    initialState: AuthState
    onStateChange(stateChanged: AuthEventHandler): void

    initRenew(): [RenewComponent, RenewComponentEventInit]
    initLoadApplication(): [LoadApplicationComponent, LoadApplicationComponentEventInit]

    initPasswordLogin(): [PasswordLoginComponent, PasswordLoginComponentEventInit]
    initPasswordResetSession(): [PasswordResetSessionComponent, PasswordResetSessionComponentEventInit]
    initPasswordReset(resetToken: ResetToken): [PasswordResetComponent, PasswordResetComponentEventInit]
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

    initRenew(): [RenewComponent, RenewComponentEventInit] {
        return [
            initRenewComponent(this.action),
            initRenewComponentEvent(this.event()),
        ]
    }
    initLoadApplication(): [LoadApplicationComponent, LoadApplicationComponentEventInit] {
        return [
            initLoadApplicationComponent(this.action),
            initLoadApplicationComponentEvent(this.event()),
        ]
    }

    initPasswordLogin(): [PasswordLoginComponent, PasswordLoginComponentEventInit] {
        return [
            initPasswordLoginComponent(
                [initLoginIDFieldComponent(this.action), initLoginIDFieldComponentEvent()],
                [initPasswordFieldComponent(this.action), initPasswordFieldComponentEvent()],
                this.action,
            ),
            initPasswordLoginComponentEvent(this.event()),
        ]
    }
    initPasswordResetSession(): [PasswordResetSessionComponent, PasswordResetSessionComponentEventInit] {
        return [
            initPasswordResetSessionComponent(
                [initLoginIDFieldComponent(this.action), initLoginIDFieldComponentEvent()],
                this.action,
            ),
            initPasswordResetSessionComponentEvent(),
        ]
    }
    initPasswordReset(resetToken: ResetToken): [PasswordResetComponent, PasswordResetComponentEventInit] {
        return [
            initPasswordResetComponent(
                [initLoginIDFieldComponent(this.action), initLoginIDFieldComponentEvent()],
                [initPasswordFieldComponent(this.action), initPasswordFieldComponentEvent()],
                this.action,
                resetToken,
            ),
            initPasswordResetComponentEvent(this.event()),
        ]
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
