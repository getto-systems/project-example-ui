import {
    PasswordFieldComponent,
    PasswordFieldComponentAction,
    PasswordFieldComponentDeprecated,
    PasswordFieldComponentEventPublisher,
    PasswordFieldComponentEventInit,
    PasswordFieldComponentState,
    PasswordFieldComponentStateHandler,
    PasswordContentHandler,
} from "../action"
import { PasswordField, PasswordFieldEventHandler, PasswordFieldDeprecated } from "../../../../field/password/action"

import { PasswordError, PasswordCharacter, PasswordView, PasswordFieldEvent } from "../../../../field/password/data"
import { Password } from "../../../../password/data"
import { InputValue, Content, Valid } from "../../../../input/data"

export function initLoginIDFieldComponent(action: PasswordFieldComponentAction): PasswordFieldComponent {
    return new Component(action)
}
export function initPasswordFieldComponentDeprecated(action: PasswordFieldComponentAction): PasswordFieldComponentDeprecated {
    return new ComponentDeprecated(action.passwordField.initPasswordFieldDeprecated())
}
export function initPasswordFieldComponentEvent(): PasswordFieldComponentEventInit {
    return (stateChanged) => new ComponentEvent(stateChanged)
}

class Component implements PasswordFieldComponent {
    handler: ComponentEventHandler
    field: PasswordField

    constructor(action: PasswordFieldComponentAction) {
        this.handler = new ComponentEventHandler()
        this.field = action.passwordField.initPasswordField(this.handler)
    }

    onContentChange(contentChanged: Publisher<Content<Password>>): void {
        this.handler.onContentChange(contentChanged)
    }
    init(stateChanged: Publisher<PasswordFieldComponentState>): void {
        this.handler.onStateChange(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
}

class ComponentEventHandler implements PasswordFieldEventHandler {
    holder: {
        content: PublisherHolder<Content<Password>>,
        state: PublisherHolder<PasswordFieldComponentState>,
    }

    constructor() {
        this.holder = {
            content: { set: false },
            state: { set: false },
        }
    }

    onContentChange(pub: Publisher<Content<Password>>): void {
        this.holder.content = { set: true, pub }
    }
    onStateChange(pub: Publisher<PasswordFieldComponentState>): void {
        this.holder.state = { set: true, pub }
    }

    publishContent(content: Content<Password>): void {
        if (this.holder.content.set) {
            this.holder.content.pub(content)
        }
    }
    publishState(state: PasswordFieldComponentState): void {
        if (this.holder.state.set) {
            this.holder.state.pub(state)
        }
    }

    handlePasswordFieldEvent(event: PasswordFieldEvent): void {
        this.publishContent(event.content)
        this.publishState({ type: "input-password", result: event.result, character: event.character, view: event.view })
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}

class ComponentDeprecated implements PasswordFieldComponentDeprecated {
    password: PasswordFieldDeprecated
    eventHolder: EventHolder<PasswordContentHandler>

    initialState: PasswordFieldComponentState = {
        type: "input-password",
        result: { valid: true },
        character: { complex: false },
        view: { show: false },
    }

    constructor(password: PasswordFieldDeprecated) {
        this.password = password
        this.eventHolder = { hasEvent: false }
    }

    onChange(changed: PasswordContentHandler): void {
        this.eventHolder = { hasEvent: true, event: changed }
    }

    async validate(event: PasswordFieldComponentEventPublisher): Promise<void> {
        this.fireChanged(this.password.validate(event))
    }
    async set(event: PasswordFieldComponentEventPublisher, passwrod: InputValue): Promise<void> {
        this.fireChanged(this.password.set(event, passwrod))
    }
    async show(event: PasswordFieldComponentEventPublisher): Promise<void> {
        this.password.show(event)
    }
    async hide(event: PasswordFieldComponentEventPublisher): Promise<void> {
        this.password.hide(event)
    }

    fireChanged(content: Content<Password>): void {
        if (this.eventHolder.hasEvent) {
            this.eventHolder.event(content)
        }
    }
}

class ComponentEvent implements PasswordFieldComponentEventPublisher {
    stateChanged: PasswordFieldComponentStateHandler

    constructor(stateChanged: PasswordFieldComponentStateHandler) {
        this.stateChanged = stateChanged
    }

    updated(result: Valid<PasswordError>, character: PasswordCharacter, view: PasswordView): void {
        this.stateChanged({ type: "input-password", result, character, view })
    }
}

type EventHolder<T> =
    Readonly<{ hasEvent: false }> |
    Readonly<{ hasEvent: true, event: T }>
