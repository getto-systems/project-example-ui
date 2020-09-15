import {
    LoginIDFieldComponentAction,
    LoginIDFieldComponentDeprecated,
    LoginIDFieldComponentState,
    LoginIDFieldComponentEventHandler,
    LoginIDFieldComponentEventPublisher,
    LoginIDFieldComponentEventInit,
    LoginIDFieldComponentStateHandler,
    LoginIDContentHandler,
} from "../action"
import { LoginIDFieldDeprecated } from "../../../../field/login_id/action"

import { LoginID } from "../../../../credential/data"
import { LoginIDFieldError, LoginIDFieldEvent } from "../../../../field/login_id/data"
import { InputValue, Content, Valid } from "../../../../input/data"

export function initLoginIDFieldComponentDeprecated(action: LoginIDFieldComponentAction): LoginIDFieldComponentDeprecated {
    return new ComponentDeprecated(action.loginIDField.initLoginIDFieldDeprecated())
}
export function initLoginIDFieldComponentEventHandler(): LoginIDFieldComponentEventHandler {
    return new ComponentEventHandler()
}
export function initLoginIDFieldComponentEvent(): LoginIDFieldComponentEventInit {
    return (stateChanged) => new ComponentEvent(stateChanged)
}

class ComponentDeprecated implements LoginIDFieldComponentDeprecated {
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

    async set(event: LoginIDFieldComponentEventPublisher, loginID: InputValue): Promise<void> {
        this.fireChanged(this.loginID.set(event, loginID))
    }
    async validate(event: LoginIDFieldComponentEventPublisher): Promise<void> {
        this.fireChanged(this.loginID.validate(event))
    }

    fireChanged(content: Content<LoginID>): void {
        if (this.eventHolder.hasEvnt) {
            this.eventHolder.event(content)
        }
    }
}

class ComponentEventHandler implements LoginIDFieldComponentEventHandler {
    holder: PublisherHolder<LoginIDFieldComponentState>

    constructor() {
        this.holder = { set: false }
    }

    publish(state: LoginIDFieldComponentState): void {
        if (this.holder.set) {
            this.holder.pub(state)
        }
    }

    handleLoginIDFieldEvent(event: LoginIDFieldEvent): void {
        this.publish({ type: "input-login-id", result: event.valid })
    }
}

class ComponentEvent implements LoginIDFieldComponentEventPublisher {
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

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
