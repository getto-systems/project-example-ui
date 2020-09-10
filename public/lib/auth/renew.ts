import { AuthAction, AuthEvent } from "../auth/action";
import { RenewEvent, StoreEvent } from "../auth_credential/action";

import { RenewError, StoreError } from "../auth_credential/data";

export interface RenewComponent {
    initialState(): RenewState
    onStateChange(stateChanged: RenewEventHandler): void

    renew(): Promise<void>
}

export type RenewState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "failed-to-store", err: StoreError }>

export interface RenewEventHandler {
    (state: RenewState): void
}

export function initRenew(action: AuthAction, authEvent: AuthEvent): RenewComponent {
    return new Component(action, authEvent);
}

class Component implements RenewComponent {
    action: AuthAction
    authEvent: AuthEvent
    eventHolder: EventHolder<ComponentEvent>

    constructor(action: AuthAction, authEvent: AuthEvent) {
        this.action = action;
        this.authEvent = authEvent;
        this.eventHolder = { hasEvent: false }
    }

    initialState(): RenewState {
        return { type: "initial-renew" };
    }

    onStateChange(stateChanged: RenewEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new ComponentEvent(stateChanged, this.authEvent) }
    }
    event(): ComponentEvent {
        return unwrap(this.eventHolder);
    }

    async renew(): Promise<void> {
        const result = await this.action.authCredential.renew(this.event());
        if (!result.success) {
            return;
        }

        await this.action.authCredential.store(this.event(), result.authCredential);
    }
}

class ComponentEvent implements RenewEvent, StoreEvent {
    stateChanged: RenewEventHandler
    authEvent: AuthEvent

    constructor(stateChanged: RenewEventHandler, authEvent: AuthEvent) {
        this.stateChanged = stateChanged;
        this.authEvent = authEvent;
    }

    tryToRenew(): void {
        this.stateChanged({ type: "try-to-renew" });
    }
    delayedToRenew(): void {
        this.stateChanged({ type: "delayed-to-renew" });
    }
    failedToRenew(err: RenewError): void {
        switch (err.type) {
            case "ticket-nonce-not-found":
            case "invalid-ticket":
                this.authEvent.tryToLogin();
                return;

            case "bad-request":
            case "server-error":
                this.authEvent.failedToAuth({ type: err.type, err: "" });
                return;

            case "bad-response":
            case "infra-error":
                this.authEvent.failedToAuth(err);
                return;

            default:
                return assertNever(err);
        }
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

function assertNever(_: never): never {
    throw new Error("NEVER");
}
