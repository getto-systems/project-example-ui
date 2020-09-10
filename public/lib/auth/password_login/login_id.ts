import { AuthAction } from "../../auth/action";
import { LoginIDField, LoginIDEvent } from "../../ability/auth_credential/action";

import { LoginID, LoginIDError } from "../../ability/auth_credential/data";
import { InputValue, InitialValue, Content, Valid } from "../../ability/input/data";

export interface LoginIDComponent {
    initialState(initial: InitialValue): LoginIDState
    onStateChange(stateChanged: LoginIDEventHandler): void

    validate(): Promise<Content<LoginID>>
    setLoginID(loginID: InputValue): Promise<void>
}

export type LoginIDState =
    Readonly<{ type: "input-login-id", result: Valid<LoginIDError> }>

export interface LoginIDEventHandler {
    (state: LoginIDState): void
}

export function initLoginID(action: AuthAction): LoginIDComponent {
    return new Component(action.authCredential.initLoginIDField());
}

class Component implements LoginIDComponent {
    loginID: LoginIDField
    eventHolder: EventHolder<ComponentEvent>

    constructor(loginID: LoginIDField) {
        this.loginID = loginID;
        this.eventHolder = { hasEvent: false }
    }

    initialState(initial: InitialValue): LoginIDState {
        const [result] = this.loginID.initialState(initial);
        return { type: "input-login-id", result };
    }

    onStateChange(stateChanged: LoginIDEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new ComponentEvent(stateChanged) }
    }
    event(): ComponentEvent {
        return unwrap(this.eventHolder);
    }

    async validate(): Promise<Content<LoginID>> {
        return this.loginID.validate(this.event());
    }
    async setLoginID(loginID: InputValue): Promise<void> {
        this.loginID.setLoginID(this.event(), loginID);
    }
}

class ComponentEvent implements LoginIDEvent {
    stateChanged: LoginIDEventHandler

    constructor(stateChanged: LoginIDEventHandler) {
        this.stateChanged = stateChanged;
    }

    updated(result: Valid<LoginIDError>): void {
        this.stateChanged({ type: "input-login-id", result });
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
