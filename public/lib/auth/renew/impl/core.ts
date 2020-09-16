import {
    RenewComponentAction,
    RenewComponent,
    RenewComponentState,
    RenewComponentOperation,
    RenewComponentEventHandler,
} from "../action"

import { TicketNonce, FetchEvent, RenewEvent, StoreEvent } from "../../../credential/data"

export function initRenewComponent(handler: RenewComponentEventHandler, action: RenewComponentAction): RenewComponent {
    return new Component(handler, action)
}
export function initRenewComponentEventHandler(): RenewComponentEventHandler {
    return new ComponentEventHandler()
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
