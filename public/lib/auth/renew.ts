import { AuthAction, AuthEvent } from "../auth/action";
import { RenewEvent, StoreEvent } from "../ability/auth_credential/action";

import { RenewError, StoreError } from "../ability/auth_credential/data";

export interface RenewComponent {
    initialState(): RenewState
    onStateChange(stateChanged: RenewEventHandler): void

    renew(): Promise<void>
}

export type RenewState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "try-to-store" }> |
    Readonly<{ type: "failed-to-store", err: StoreError }>

export interface RenewEventHandler {
    (state: RenewState): void
}

export function initRenew(action: AuthAction, authEvent: AuthEvent): RenewComponent {
    return new RenewComponentImpl(action, authEvent);
}

class RenewComponentImpl implements RenewComponent {
    action: AuthAction
    authEvent: AuthEvent
    eventHolder: EventHolder<EventImpl>

    constructor(action: AuthAction, authEvent: AuthEvent) {
        this.action = action;
        this.authEvent = authEvent;
        this.eventHolder = { hasEvent: false }
    }

    initialState(): RenewState {
        return { type: "initial-renew" };
    }

    onStateChange(stateChanged: RenewEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new EventImpl(this.authEvent, stateChanged) }
    }
    event(): EventImpl {
        return unwrap(this.eventHolder);
    }

    async renew(): Promise<void> {
        const result = await this.action.authCredential.renew_withEvent(this.event());
        if (!result.success) {
            return;
        }

        this.action.authCredential.store_withEvent(this.event(), result.authCredential);
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

class EventImpl implements RenewEvent, StoreEvent {
    authEvent: AuthEvent
    stateChanged: RenewEventHandler

    constructor(authEvent: AuthEvent, stateChanged: RenewEventHandler) {
        this.authEvent = authEvent;
        this.stateChanged = stateChanged;
    }

    tryToRenew(): void {
        this.stateChanged({ type: "try-to-renew" });
    }
    delayedToRenew(): void {
        this.stateChanged({ type: "delayed-to-renew" });
    }
    failedToRenew(err: RenewError): void {
        switch (err.type) {
            case "empty-nonce":
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

    tryToStore(): void {
        this.stateChanged({ type: "try-to-store" });
    }
    failedToStore(err: StoreError): void {
        this.stateChanged({ type: "failed-to-store", err });
    }
    succeedToStore(): void {
        this.authEvent.succeedToAuth();
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
