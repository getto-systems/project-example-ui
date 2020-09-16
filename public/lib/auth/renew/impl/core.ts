import {
    RenewComponentAction,
    RenewComponent,
    RenewComponentState,
    RenewComponentOperation,
    RenewComponentEventHandler,
    RenewComponentDeprecated,
    RenewComponentEventPublisher,
    RenewComponentEventInit,
    RenewComponentStateHandler,
} from "../action"

import { AuthUsecaseEventHandler } from "../../../auth/data"

import { TicketNonce, FetchEvent, RenewEvent, StoreEvent, RenewError, StoreError } from "../../../credential/data"

export function initRenewComponent(handler: RenewComponentEventHandler, action: RenewComponentAction): RenewComponent {
    return new Component(handler, action)
}
export function initRenewComponentEventHandler(): RenewComponentEventHandler {
    return new ComponentEventHandler()
}
export function initRenewComponentDeprecated(action: RenewComponentAction): RenewComponentDeprecated {
    return new ComponentDeprecated(action)
}
export function initRenewComponentEvent(authEvent: AuthUsecaseEventHandler): RenewComponentEventInit {
    return (stateChanged) => new ComponentEvent(authEvent, stateChanged)
}

class Component implements RenewComponent {
    handler: RenewComponentEventHandler
    action: RenewComponentAction

    constructor(handler: RenewComponentEventHandler, action: RenewComponentAction) {
        this.handler = handler
        this.action = action
    }

    init(stateChanged: Publisher<RenewComponentState>): void {
        this.handler.onStateChange(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
    trigger(operation: RenewComponentOperation): Promise<void> {
        return this.renew(operation.ticketNonce)
    }

    renew(ticketNonce: TicketNonce): Promise<void> {
        return this.action.credential.renew(ticketNonce)
    }
}

class ComponentEventHandler implements RenewComponentEventHandler {
    holder: PublisherHolder<RenewComponentState>

    constructor() {
        this.holder = { set: false }
    }

    onStateChange(pub: Publisher<RenewComponentState>): void {
        this.holder = { set: true, pub }
    }

    handleFetchEvent(_event: FetchEvent): void {
        // RenewComponent ではこのイベントは発生しない
    }
    handleRenewEvent(event: RenewEvent): void {
        this.publish(event)
    }
    handleStoreEvent(_event: StoreEvent): void {
        // RenewComponent ではこのイベントは発生しない
    }

    publish(state: RenewComponentState): void {
        if (this.holder.set) {
            this.holder.pub(state)
        }
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}

class ComponentDeprecated implements RenewComponentDeprecated {
    action: RenewComponentAction

    initialState: RenewComponentState = { type: "initial-renew" }

    constructor(action: RenewComponentAction) {
        this.action = action
    }

    async renew(event: RenewComponentEventPublisher): Promise<void> {
        const result = await this.action.credential.renewDeprecated(event)
        if (!result.success) {
            return
        }

        await this.action.credential.storeDeprecated(event, result.authCredential)
    }
}

class ComponentEvent implements RenewComponentEventPublisher {
    authEvent: AuthUsecaseEventHandler
    stateChanged: RenewComponentStateHandler

    constructor(authEvent: AuthUsecaseEventHandler, stateChanged: RenewComponentStateHandler) {
        this.authEvent = authEvent
        this.stateChanged = stateChanged
    }

    tryToRenew(): void {
        this.stateChanged({ type: "try-to-renew" })
    }
    delayedToRenew(): void {
        this.stateChanged({ type: "delayed-to-renew" })
    }
    failedToRenew(err: RenewError): void {
        switch (err.type) {
            case "ticket-nonce-not-found":
            case "invalid-ticket":
                this.authEvent.handleAuthEvent({ type: "try-to-login" })
                return

            case "bad-request":
            case "server-error":
            case "bad-response":
            case "infra-error":
                this.authEvent.handleAuthEvent({ type: "failed-to-login", err: { type: "renew", err } })
                return

            default:
                return assertNever(err)
        }
    }

    failedToStore(err: StoreError): void {
        this.stateChanged({ type: "failed-to-renew", err })
    }
    succeedToStore(): void {
        this.authEvent.handleAuthEvent({ type: "succeed-to-login" })
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
