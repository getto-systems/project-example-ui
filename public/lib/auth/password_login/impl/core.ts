import { LoginIDFieldComponent } from "../../field/login_id/action"
import { PasswordFieldComponent } from "../../field/password/action"

import { AuthEvent } from "../../../auth/action"
import {
    PasswordLoginComponentAction,
    PasswordLoginComponent,
    PasswordLoginComponentEvent,
    PasswordLoginComponentState,
    PasswordLoginComponentStateHandler,
} from "../action"

import { StoreError } from "../../../credential/data"
import { InputContent, LoginError } from "../../../password_login/data"

export function initPasswordLogin(loginID: LoginIDFieldComponent, password: PasswordFieldComponent, action: PasswordLoginComponentAction, authEvent: AuthEvent): PasswordLoginComponent {
    return new Component(loginID, password, action, authEvent)
}

class Component implements PasswordLoginComponent {
    loginID: LoginIDFieldComponent
    password: PasswordFieldComponent

    action: PasswordLoginComponentAction
    authEvent: AuthEvent
    eventHolder: EventHolder<ComponentEvent>

    initialState: PasswordLoginComponentState = { type: "initial-login" }

    constructor(loginID: LoginIDFieldComponent, password: PasswordFieldComponent, action: PasswordLoginComponentAction, authEvent: AuthEvent) {
        this.action = action
        this.authEvent = authEvent
        this.eventHolder = { hasEvent: false }

        this.loginID = loginID
        this.password = password
    }

    onStateChange(stateChanged: PasswordLoginComponentStateHandler): void {
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

class ComponentEvent implements PasswordLoginComponentEvent {
    stateChanged: PasswordLoginComponentStateHandler
    authEvent: AuthEvent

    constructor(stateChanged: PasswordLoginComponentStateHandler, authEvent: AuthEvent) {
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
