import {
    PasswordFieldComponentAction,
    PasswordFieldComponent,
    PasswordFieldComponentEvent,
    PasswordFieldComponentState,
    PasswordFieldComponentStateHandler,
} from "../action"
import { PasswordField } from "../../../../password/action"

import { Password, PasswordError, PasswordCharacter, PasswordView } from "../../../../password/data"
import { InputValue, Content, Valid } from "../../../../input/data"

export function initPasswordField(action: PasswordFieldComponentAction): PasswordFieldComponent {
    return new Component(action.password.initPasswordField())
}

class Component implements PasswordFieldComponent {
    password: PasswordField
    eventHolder: EventHolder<PasswordFieldComponentEvent>

    initialState: PasswordFieldComponentState = {
        type: "input-password",
        result: { valid: true },
        character: { complex: false },
        view: { show: false },
    }

    constructor(password: PasswordField) {
        this.password = password
        this.eventHolder = { hasEvent: false }
    }

    onStateChange(stateChanged: PasswordFieldComponentStateHandler): void {
        this.eventHolder = { hasEvent: true, event: new ComponentEvent(stateChanged) }
    }
    event(): PasswordFieldComponentEvent {
        return unwrap(this.eventHolder)
    }

    async validate(): Promise<Content<Password>> {
        return this.password.validate(this.event())
    }
    async setPassword(passwrod: InputValue): Promise<void> {
        this.password.setPassword(this.event(), passwrod)
    }
    async showPassword(): Promise<void> {
        this.password.showPassword(this.event())
    }
    async hidePassword(): Promise<void> {
        this.password.hidePassword(this.event())
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
function unwrap<T>(holder: EventHolder<T>): T {
    if (!holder.hasEvent) {
        throw new Error("event is not initialized")
    }
    return holder.event
}
