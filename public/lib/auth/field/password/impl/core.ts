import {
    PasswordFieldComponentAction,
    PasswordFieldComponent,
    PasswordFieldComponentEvent,
    PasswordFieldComponentEventInit,
    PasswordFieldComponentState,
    PasswordFieldComponentStateHandler,
    PasswordContentHandler,
} from "../action"
import { PasswordFieldDeprecated } from "../../../../field/password/action"

import { PasswordError, PasswordCharacter, PasswordView } from "../../../../field/password/data"
import { Password } from "../../../../password/data"
import { InputValue, Content, Valid } from "../../../../input/data"

export function initPasswordFieldComponent(action: PasswordFieldComponentAction): PasswordFieldComponent {
    return new Component(action.passwordField.initPasswordFieldDeprecated())
}
export function initPasswordFieldComponentEvent(): PasswordFieldComponentEventInit {
    return (stateChanged) => new ComponentEvent(stateChanged)
}

class Component implements PasswordFieldComponent {
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

    async validate(event: PasswordFieldComponentEvent): Promise<void> {
        this.fireChanged(this.password.validate(event))
    }
    async set(event: PasswordFieldComponentEvent, passwrod: InputValue): Promise<void> {
        this.fireChanged(this.password.set(event, passwrod))
    }
    async show(event: PasswordFieldComponentEvent): Promise<void> {
        this.password.show(event)
    }
    async hide(event: PasswordFieldComponentEvent): Promise<void> {
        this.password.hide(event)
    }

    fireChanged(content: Content<Password>): void {
        if (this.eventHolder.hasEvent) {
            this.eventHolder.event(content)
        }
    }
}

class ComponentEvent implements PasswordFieldComponentEvent {
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
