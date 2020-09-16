import {
    RenewCredentialComponentAction,
    RenewCredentialComponent,
    RenewCredentialComponentState,
    RenewCredentialComponentOperation,
    RenewCredentialComponentEventHandler,
} from "../action"

import { TicketNonce, FetchEvent, RenewEvent, StoreEvent } from "../../../credential/data"

export function initRenewCredentialComponent(
    handler: RenewCredentialComponentEventHandler,
    action: RenewCredentialComponentAction,
): RenewCredentialComponent {
    return new Component(handler, action)
}
export function initRenewCredentialComponentEventHandler(): RenewCredentialComponentEventHandler {
    return new ComponentEventHandler()
}

class Component implements RenewCredentialComponent {
    handler: RenewCredentialComponentEventHandler
    action: RenewCredentialComponentAction

    constructor(handler: RenewCredentialComponentEventHandler, action: RenewCredentialComponentAction) {
        this.handler = handler
        this.action = action
    }

    init(stateChanged: Publisher<RenewCredentialComponentState>): void {
        this.handler.onStateChange(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
    trigger(operation: RenewCredentialComponentOperation): Promise<void> {
        return this.renew(operation.ticketNonce)
    }

    renew(ticketNonce: TicketNonce): Promise<void> {
        return this.action.credential.renew(ticketNonce)
    }
}

class ComponentEventHandler implements RenewCredentialComponentEventHandler {
    holder: PublisherHolder<RenewCredentialComponentState>

    constructor() {
        this.holder = { set: false }
    }

    onStateChange(pub: Publisher<RenewCredentialComponentState>): void {
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

    publish(state: RenewCredentialComponentState): void {
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
