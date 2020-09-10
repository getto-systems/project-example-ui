import { LoginIDComponent, initLoginID } from "./password_login/login_id";
import { PasswordComponent, initPassword } from "./password_login/password";

import { AuthAction, AuthEvent } from "../auth/action";
import { StoreEvent } from "../auth_credential/action";
import { LoginEvent } from "../password_login/action";

import { StoreError } from "../auth_credential/data";
import { InputContent, LoginError } from "../password_login/data";

export interface PasswordLoginComponent {
    fields(): PasswordLoginFieldComponents

    initialState(): LoginState
    onStateChange(stateChanged: LoginEventHandler): void

    login(): Promise<void>
}

export type PasswordLoginFieldComponents = [LoginIDComponent, PasswordComponent]

export type LoginState =
    Readonly<{ type: "initial-login" }> |
    Readonly<{ type: "try-to-login" }> |
    Readonly<{ type: "delayed-to-login" }> |
    Readonly<{ type: "failed-to-login", content: InputContent, err: LoginError }> |
    Readonly<{ type: "failed-to-store", err: StoreError }>

export interface LoginEventHandler {
    (state: LoginState): void
}

export function initPasswordLogin(action: AuthAction, authEvent: AuthEvent): PasswordLoginComponent {
    return new Component(action, authEvent);
}

class Component implements PasswordLoginComponent {
    loginID: LoginIDComponent
    password: PasswordComponent

    action: AuthAction
    authEvent: AuthEvent
    eventHolder: EventHolder<ComponentEvent>

    constructor(action: AuthAction, authEvent: AuthEvent) {
        this.action = action;
        this.authEvent = authEvent;
        this.eventHolder = { hasEvent: false }

        this.loginID = initLoginID(this.action);
        this.password = initPassword(this.action);
    }

    fields(): PasswordLoginFieldComponents {
        return [this.loginID, this.password]
    }

    initialState(): LoginState {
        return { type: "initial-login" };
    }

    onStateChange(stateChanged: LoginEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new ComponentEvent(stateChanged, this.authEvent) }
    }
    event(): ComponentEvent {
        return unwrap(this.eventHolder);
    }

    async login(): Promise<void> {
        const result = await this.action.passwordLogin.login(this.event(), await Promise.all([
            this.loginID.validate(),
            this.password.validate(),
        ]));
        if (!result.success) {
            return;
        }

        await this.action.authCredential.store(this.event(), result.authCredential);
    }
}

class ComponentEvent implements LoginEvent, StoreEvent {
    stateChanged: LoginEventHandler
    authEvent: AuthEvent

    constructor(stateChanged: LoginEventHandler, authEvent: AuthEvent) {
        this.stateChanged = stateChanged;
        this.authEvent = authEvent;
    }

    tryToLogin(): void {
        this.stateChanged({ type: "try-to-login" });
    }
    delayedToLogin(): void {
        this.stateChanged({ type: "delayed-to-login" });
    }
    failedToLogin(content: InputContent, err: LoginError): void {
        this.stateChanged({ type: "failed-to-login", content, err });
    }

    failedToStore(err: StoreError): void {
        this.stateChanged({ type: "failed-to-store", err });
    }
    succeedToStore(): void {
        this.authEvent.succeedToAuth();
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
