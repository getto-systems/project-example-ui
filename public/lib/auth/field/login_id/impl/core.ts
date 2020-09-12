import {
    LoginIDFieldComponentAction,
    LoginIDFieldComponent,
    LoginIDFieldComponentState,
    LoginIDFieldComponentEvent,
    LoginIDFieldComponentEventInit,
    LoginIDFieldComponentStateHandler,
    LoginIDContentHandler,
} from "../action"
import { LoginIDField } from "../../../../credential/action"

import { LoginID, LoginIDError } from "../../../../credential/data"
import { InputValue, Content, Valid } from "../../../../input/data"

export function initLoginIDFieldComponent(action: LoginIDFieldComponentAction): LoginIDFieldComponent {
    return new Component(action.credential.initLoginIDField())
}
export function initLoginIDFieldComponentEvent(): LoginIDFieldComponentEventInit {
    return (stateChanged) => new ComponentEvent(stateChanged)
}

class Component implements LoginIDFieldComponent {
    loginID: LoginIDField
    eventHolder: EventHolder<LoginIDContentHandler>

    initialState: LoginIDFieldComponentState = { type: "input-login-id", result: { valid: true } }

    constructor(loginID: LoginIDField) {
        this.loginID = loginID
        this.eventHolder = { hasEvnt: false }
    }

    onChange(changed: LoginIDContentHandler): void {
        this.eventHolder = { hasEvnt: true, event: changed }
    }

    async set(event: LoginIDFieldComponentEvent, loginID: InputValue): Promise<void> {
        this.fireChanged(this.loginID.set(event, loginID))
    }
    async validate(event: LoginIDFieldComponentEvent): Promise<void> {
        this.fireChanged(this.loginID.validate(event))
    }

    fireChanged(content: Content<LoginID>): void {
        if (this.eventHolder.hasEvnt) {
            this.eventHolder.event(content)
        }
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
    Readonly<{ hasEvnt: false }> |
    Readonly<{ hasEvnt: true, event: T }>
