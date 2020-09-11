import { AuthAction } from "../../auth/action"
import { LoginIDField, LoginIDEvent } from "../../credential/action"

import { LoginID, LoginIDError } from "../../credential/data"
import { InputValue, Content, Valid } from "../../input/data"

export interface LoginIDFieldComponent {
    initialState: LoginIDState
    onStateChange(stateChanged: LoginIDEventHandler): void

    validate(): Promise<Content<LoginID>>
    setLoginID(loginID: InputValue): Promise<void>
}

export type LoginIDState =
    Readonly<{ type: "input-login-id", result: Valid<LoginIDError> }>

export interface LoginIDEventHandler {
    (state: LoginIDState): void
}

export function initLoginIDField(action: AuthAction): LoginIDFieldComponent {
    return new Component(action.authCredential.initLoginIDField())
}

class Component implements LoginIDFieldComponent {
    loginID: LoginIDField
    eventHolder: EventHolder<ComponentEvent>

    initialState: LoginIDState = { type: "input-login-id", result: { valid: true } }

    constructor(loginID: LoginIDField) {
        this.loginID = loginID
        this.eventHolder = { hasEvent: false }
    }

    onStateChange(stateChanged: LoginIDEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new ComponentEvent(stateChanged) }
    }
    event(): ComponentEvent {
        return unwrap(this.eventHolder)
    }

    async validate(): Promise<Content<LoginID>> {
        return this.loginID.validate(this.event())
    }
    async setLoginID(loginID: InputValue): Promise<void> {
        this.loginID.setLoginID(this.event(), loginID)
    }
}

class ComponentEvent implements LoginIDEvent {
    stateChanged: LoginIDEventHandler

    constructor(stateChanged: LoginIDEventHandler) {
        this.stateChanged = stateChanged
    }

    updated(result: Valid<LoginIDError>): void {
        this.stateChanged({ type: "input-login-id", result })
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
