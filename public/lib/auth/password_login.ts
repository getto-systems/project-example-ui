import { LoginIDFieldComponent } from "./field/login_id"
import { PasswordFieldComponent } from "./field/password"

import { AuthEvent } from "../auth/action"
import { CredentialAction, StoreEvent } from "../credential/action"
import { PasswordLoginAction, LoginEvent } from "../password_login/action"

import { StoreError } from "../credential/data"
import { InputContent, LoginError } from "../password_login/data"

export interface PasswordLoginComponentAction {
    credential: CredentialAction
    passwordLogin: PasswordLoginAction
}

export interface PasswordLoginComponent {
    loginID: LoginIDFieldComponent
    password: PasswordFieldComponent

    initialState: LoginState

    onStateChange(stateChanged: LoginEventHandler): void

    login(): Promise<void>
}

export type PasswordLoginFieldComponents = [LoginIDFieldComponent, PasswordFieldComponent]

export type LoginState =
    Readonly<{ type: "initial-login" }> |
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "delayed-to-login" }> |
    Readonly<{ type: "failed-to-login", content: InputContent, err: LoginError }> |
    Readonly<{ type: "failed-to-store", err: StoreError }>

export interface LoginEventHandler {
    (state: LoginState): void
}

export function initPasswordLogin(loginID: LoginIDFieldComponent, password: PasswordFieldComponent, action: PasswordLoginComponentAction, authEvent: AuthEvent): PasswordLoginComponent {
    return new Component(loginID, password, action, authEvent)
}

class Component implements PasswordLoginComponent {
    loginID: LoginIDFieldComponent
    password: PasswordFieldComponent

    action: PasswordLoginComponentAction
    authEvent: AuthEvent
    eventHolder: EventHolder<ComponentEvent>

    initialState: LoginState = { type: "initial-login" }

    constructor(loginID: LoginIDFieldComponent, password: PasswordFieldComponent, action: PasswordLoginComponentAction, authEvent: AuthEvent) {
        this.action = action
        this.authEvent = authEvent
        this.eventHolder = { hasEvent: false }

        this.loginID = loginID
        this.password = password
    }

    onStateChange(stateChanged: LoginEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new ComponentEvent(stateChanged, this.authEvent) }
    }
    event(): ComponentEvent {
        return unwrap(this.eventHolder)
    }

    async login(): Promise<void> {
        const result = await this.action.passwordLogin.login(this.event(), await Promise.all([
            this.loginID.validate(),
            this.password.validate(),
        ]))
        if (!result.success) {
            return
        }

        await this.action.credential.store(this.event(), result.authCredential)
    }
}

class ComponentEvent implements LoginEvent, StoreEvent {
    stateChanged: LoginEventHandler
    authEvent: AuthEvent

    constructor(stateChanged: LoginEventHandler, authEvent: AuthEvent) {
        this.stateChanged = stateChanged
        this.authEvent = authEvent
    }

    tryToLogin(): void {
        this.stateChanged({ type: "try-to-login" })
    }
    delayedToLogin(): void {
        this.stateChanged({ type: "delayed-to-login" })
    }
    failedToLogin(content: InputContent, err: LoginError): void {
        this.stateChanged({ type: "failed-to-login", content, err })
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
