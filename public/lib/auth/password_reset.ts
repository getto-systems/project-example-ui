import { LoginIDFieldComponent } from "./field/login_id"
import { PasswordFieldComponent } from "./field/password"

import { AuthEvent } from "../auth/action"
import { CredentialAction, StoreEvent } from "../credential/action"
import { PasswordResetAction, ResetEvent } from "../password_reset/action"

import { StoreError } from "../credential/data"
import { InputContent, ResetToken, ResetError } from "../password_reset/data"

export interface PasswordResetComponentAction {
    credential: CredentialAction
    passwordReset: PasswordResetAction
}

export interface PasswordResetComponent {
    loginID: LoginIDFieldComponent
    password: PasswordFieldComponent

    initialState: ResetState

    onStateChange(stateChanged: ResetEventHandler): void

    reset(): Promise<void>
}

export type PasswordResetFieldComponents = [LoginIDFieldComponent, PasswordFieldComponent]

export type ResetState =
    Readonly<{ type: "initial-reset" }> |
    Readonly<{ type: "try-to-reset" }> |
    Readonly<{ type: "delayed-to-reset" }> |
    Readonly<{ type: "failed-to-reset", content: InputContent, err: ResetError }> |
    Readonly<{ type: "failed-to-store", err: StoreError }>

export interface ResetEventHandler {
    (state: ResetState): void
}

export function initPasswordReset(loginID: LoginIDFieldComponent, password: PasswordFieldComponent, action: PasswordResetComponentAction, authEvent: AuthEvent, resetToken: ResetToken): PasswordResetComponent {
    return new Component(loginID, password, action, authEvent, resetToken)
}

class Component implements PasswordResetComponent {
    loginID: LoginIDFieldComponent
    password: PasswordFieldComponent

    action: PasswordResetComponentAction
    authEvent: AuthEvent
    eventHolder: EventHolder<ComponentEvent>

    resetToken: ResetToken

    initialState: ResetState = { type: "initial-reset" }

    constructor(loginID: LoginIDFieldComponent, password: PasswordFieldComponent, action: PasswordResetComponentAction, authEvent: AuthEvent, resetToken: ResetToken) {
        this.action = action
        this.authEvent = authEvent
        this.eventHolder = { hasEvent: false }

        this.resetToken = resetToken

        this.loginID = loginID
        this.password = password
    }

    onStateChange(stateChanged: ResetEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new ComponentEvent(stateChanged, this.authEvent) }
    }
    event(): ComponentEvent {
        return unwrap(this.eventHolder)
    }

    async reset(): Promise<void> {
        const result = await this.action.passwordReset.reset(this.event(), this.resetToken, await Promise.all([
            this.loginID.validate(),
            this.password.validate(),
        ]))
        if (!result.success) {
            return
        }

        await this.action.credential.store(this.event(), result.authCredential)
    }
}

class ComponentEvent implements ResetEvent, StoreEvent {
    stateChanged: ResetEventHandler
    authEvent: AuthEvent

    constructor(stateChanged: ResetEventHandler, authEvent: AuthEvent) {
        this.stateChanged = stateChanged
        this.authEvent = authEvent
    }

    tryToReset(): void {
        this.stateChanged({ type: "try-to-reset" })
    }
    delayedToReset(): void {
        this.stateChanged({ type: "delayed-to-reset" })
    }
    failedToReset(content: InputContent, err: ResetError): void {
        this.stateChanged({ type: "failed-to-reset", content, err })
    }

    failedToStore(err: StoreError): void {
        this.stateChanged({ type: "failed-to-store", err })
    }
    succeedToStore(): void {
        this.authEvent.succeedToAuth()
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
