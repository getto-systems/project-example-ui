import {
    LoginIDFieldComponentAction,
    LoginIDFieldComponent,
    LoginIDFieldComponentState,
    LoginIDFieldComponentEvent,
    LoginIDFieldComponentEventInit,
    LoginIDFieldComponentStateHandler,
    LoginIDContentHandler,
} from "../action"
import { LoginIDFieldDeprecated } from "../../../../field/login_id/action"

import { LoginID } from "../../../../credential/data"
import { LoginIDFieldError } from "../../../../field/login_id/data"
import { InputValue, Content, Valid } from "../../../../input/data"

export function initLoginIDFieldComponent(action: LoginIDFieldComponentAction): LoginIDFieldComponent {
    return new Component(action.loginIDField.initLoginIDFieldDeprecated())
}
export function initLoginIDFieldComponentEvent(): LoginIDFieldComponentEventInit {
    return (stateChanged) => new ComponentEvent(stateChanged)
}

class Component implements LoginIDFieldComponent {
    loginID: LoginIDFieldDeprecated
    eventHolder: EventHolder<LoginIDContentHandler>

    initialState: LoginIDFieldComponentState = { type: "input-login-id", result: { valid: true } }

    constructor(loginID: LoginIDFieldDeprecated) {
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

    updated(result: Valid<LoginIDFieldError>): void {
        this.stateChanged({ type: "input-login-id", result })
    }
}

type EventHolder<T> =
    Readonly<{ hasEvnt: false }> |
    Readonly<{ hasEvnt: true, event: T }>
