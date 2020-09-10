import { AuthAction } from "../../auth/action";
import { PasswordField, PasswordEvent } from "../../ability/password/action";

import { Password, PasswordError, PasswordCharacter, PasswordView } from "../../ability/password/data";
import { InputValue, InitialValue, Content, Valid } from "../../ability/input/data";

export interface PasswordComponent {
    initialState(initial: InitialValue): PasswordState
    onStateChange(stateChanged: PasswordEventHandler): void

    validate(): Promise<Content<Password>>
    setPassword(password: InputValue): Promise<void>
    showPassword(): Promise<void>
    hidePassword(): Promise<void>
}

export type PasswordState =
    Readonly<{ type: "input-password", result: Valid<PasswordError>, character: PasswordCharacter, view: PasswordView }>

export interface PasswordEventHandler {
    (state: PasswordState): void
}

export function initPassword(action: AuthAction): PasswordComponent {
    return new Component(action.password.initPasswordField());
}

class Component implements PasswordComponent {
    password: PasswordField
    eventHolder: EventHolder<ComponentEvent>

    constructor(password: PasswordField) {
        this.password = password;
        this.eventHolder = { hasEvent: false }
    }

    initialState(initial: InitialValue): PasswordState {
        const [result, character, view] = this.password.initialState(initial);
        return { type: "input-password", result, character, view };
    }

    onStateChange(stateChanged: PasswordEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new ComponentEvent(stateChanged) }
    }
    event(): ComponentEvent {
        return unwrap(this.eventHolder);
    }

    async validate(): Promise<Content<Password>> {
        return this.password.validate(this.event());
    }
    async setPassword(passwrod: InputValue): Promise<void> {
        this.password.setPassword(this.event(), passwrod);
    }
    async showPassword(): Promise<void> {
        this.password.showPassword(this.event());
    }
    async hidePassword(): Promise<void> {
        this.password.hidePassword(this.event());
    }
}

class ComponentEvent implements PasswordEvent {
    stateChanged: PasswordEventHandler

    constructor(stateChanged: PasswordEventHandler) {
        this.stateChanged = stateChanged;
    }

    updated(result: Valid<PasswordError>, character: PasswordCharacter, view: PasswordView): void {
        this.stateChanged({ type: "input-password", result, character, view });
    }
}

type EventHolder<T> =
    Readonly<{ hasEvent: false }> |
    Readonly<{ hasEvent: true, event: T }>
function unwrap<T>(holder: EventHolder<T>): T {
    if (!holder.hasEvent) {
        throw new Error("event is not initialized");
    }
    return holder.event;
}
