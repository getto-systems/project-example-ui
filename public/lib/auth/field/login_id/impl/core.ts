import {
    LoginIDFieldComponentAction,
    LoginIDFieldComponent,
    LoginIDFieldComponentEvent,
    LoginIDFieldComponentState,
    LoginIDFieldComponentStateHandler,
} from "../action"
import { LoginIDField } from "../../../../credential/action"

import { LoginID, LoginIDError } from "../../../../credential/data"
import { InputValue, Content, Valid } from "../../../../input/data"

export function initLoginIDField(action: LoginIDFieldComponentAction): LoginIDFieldComponent {
    return new Component(action.credential.initLoginIDField())
}

class Component implements LoginIDFieldComponent {
    loginID: LoginIDField
    eventHolder: EventHolder<ComponentEvent>

    initialState: LoginIDFieldComponentState = { type: "input-login-id", result: { valid: true } }

    constructor(loginID: LoginIDField) {
        this.loginID = loginID
        this.eventHolder = { hasEvent: false }
    }

    onStateChange(stateChanged: LoginIDFieldComponentStateHandler): void {
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

class ComponentEvent implements LoginIDFieldComponentEvent {
    stateChanged: LoginIDFieldComponentStateHandler

    constructor(stateChanged: LoginIDFieldComponentStateHandler) {
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
