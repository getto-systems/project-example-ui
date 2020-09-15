import {
    LoginIDFieldComponentAction,
    LoginIDFieldComponent,
    LoginIDFieldComponentDeprecated,
    LoginIDFieldComponentEventHandler,
    LoginIDFieldComponentEventPublisher,
    LoginIDFieldComponentEventInit,
    LoginIDFieldComponentStateHandler,
    LoginIDContentHandler,
} from "../action"
import { LoginIDField, LoginIDFieldDeprecated } from "../../../../field/login_id/action"

import { LoginIDFieldComponentState } from "../data"

import { LoginID } from "../../../../credential/data"
import { LoginIDFieldError, LoginIDFieldEvent } from "../../../../field/login_id/data"
import { InputValue, Content, Valid } from "../../../../input/data"

export function initLoginIDFieldComponent(handler: LoginIDFieldComponentEventHandler, action: LoginIDFieldComponentAction): LoginIDFieldComponent {
    return new Component(handler, action.loginIDField.initLoginIDField())
}
export function initLoginIDFieldComponentEventHandler(): LoginIDFieldComponentEventHandler {
    return new ComponentEventHandler()
}
export function initLoginIDFieldComponentDeprecated(action: LoginIDFieldComponentAction): LoginIDFieldComponentDeprecated {
    return new ComponentDeprecated(action.loginIDField.initLoginIDFieldDeprecated())
}
export function initLoginIDFieldComponentEvent(): LoginIDFieldComponentEventInit {
    return (stateChanged) => new ComponentEvent(stateChanged)
}

class Component implements LoginIDFieldComponent {
    handler: LoginIDFieldComponentEventHandler
    field: LoginIDField

    constructor(
        handler: LoginIDFieldComponentEventHandler,
        field: LoginIDField,
    ) {
        this.handler = handler
        this.field = field
    }

    onContentChange(contentChanged: Publisher<Content<LoginID>>): void {
        this.handler.onContentChange(contentChanged)
    }
    init(stateChanged: Publisher<LoginIDFieldComponentState>): void {
        this.handler.onStateChange(stateChanged)
    }

    async set(loginID: InputValue): Promise<void> {
        this.field.set(loginID)
    }

    async validate(): Promise<void> {
        this.field.validate()
    }
}

class ComponentEventHandler implements LoginIDFieldComponentEventHandler {
    holder: {
        content: PublisherHolder<Content<LoginID>>,
        state: PublisherHolder<LoginIDFieldComponentState>,
    }

    constructor() {
        this.holder = {
            content: { set: false },
            state: { set: false },
        }
    }

    onContentChange(pub: LoginIDContentHandler): void {
        this.holder.content = { set: true, pub }
    }
    onStateChange(pub: LoginIDFieldComponentStateHandler): void {
        this.holder.state = { set: true, pub }
    }

    publish(content: Content<LoginID>, state: LoginIDFieldComponentState): void {
        if (this.holder.content.set) {
            this.holder.content.pub(content)
        }
        if (this.holder.state.set) {
            this.holder.state.pub(state)
        }
    }

    handleLoginIDFieldEvent(event: LoginIDFieldEvent): void {
        this.publish(event.content, { type: "input-login-id", result: event.valid })
    }
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
