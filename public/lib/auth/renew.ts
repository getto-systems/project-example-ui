import { AuthAction, AuthEvent } from "../auth/action";

import { RenewEvent, RenewError, StoreError } from "../ability/auth_credential/data";

export interface RenewComponent {
    initialState(): RenewState
    onStateChange(stateChanged: RenewEventHandler): void

    renew(): void
}

export type RenewState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "try-to-store" }> |
    Readonly<{ type: "failed-to-store", err: StoreError }>
const renew_Initial: RenewState = { type: "initial-renew" }
const renew_Try: RenewState = { type: "try-to-renew" }
const renew_Delayed: RenewState = { type: "delayed-to-renew" }
const store_Try: RenewState = { type: "try-to-store" }
function store_Failed(err: StoreError): RenewState {
    return { type: "failed-to-store", err }
}

export interface RenewEventHandler {
    (state: RenewState): void
}

export function initRenew(action: AuthAction, authEvent: AuthEvent): RenewComponent {
    return new RenewComponentImpl(action, authEvent);
}

class RenewComponentImpl implements RenewComponent {
    action: AuthAction
    authEvent: AuthEvent
    eventHolder: EventHolder<RenewEvent>

    constructor(action: AuthAction, authEvent: AuthEvent) {
        this.action = action;
        this.authEvent = authEvent;
        this.eventHolder = { hasEvent: false }
    }

    initialState(): RenewState {
        return renew_Initial;
    }

    onStateChange(stateChanged: RenewEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new RenewEventImpl(this.authEvent, stateChanged) }
    }
    event(): RenewEvent {
        return unwrap(this.eventHolder);
    }

    renew(): void {
        this.action.authCredential.renew_withEvent(this.event());
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

class RenewEventImpl implements RenewEvent {
    authEvent: AuthEvent
    stateChanged: RenewEventHandler

    constructor(authEvent: AuthEvent, stateChanged: RenewEventHandler) {
        this.authEvent = authEvent;
        this.stateChanged = stateChanged;
    }

    tryToRenew(): void {
        this.stateChanged(renew_Try);
    }
    delayedToRenew(): void {
        this.stateChanged(renew_Delayed);
    }
    failedToRenew(err: RenewError): void {
        this.authEvent.failedToRenew(err);
    }
    tryToStore(): void {
        this.stateChanged(store_Try);
    }
    failedToStore(err: StoreError): void {
        this.stateChanged(store_Failed(err));
    }
    succeedToRenew(): void {
        this.authEvent.succeedToRenew();
    }
}
