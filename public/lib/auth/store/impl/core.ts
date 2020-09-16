import { StoreComponentAction } from "../action"

import { StoreComponent, StoreComponentState, StoreComponentEventHandler } from "../data"

import { AuthCredential, FetchEvent, RenewEvent, StoreEvent } from "../../../credential/data"

export function initStoreComponent(handler: StoreComponentEventHandler, action: StoreComponentAction): StoreComponent {
    return new Component(handler, action)
}
export function initStoreComponentEventHandler(): StoreComponentEventHandler {
    return new ComponentEventHandler()
}

class Component implements StoreComponent {
    handler: StoreComponentEventHandler
    action: StoreComponentAction

    constructor(handler: StoreComponentEventHandler, action: StoreComponentAction) {
        this.handler = handler
        this.action = action
    }

    init(stateChanged: Publisher<StoreComponentState>): void {
        this.handler.onStateChange(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
    store(authCredential: AuthCredential): Promise<void> {
        return this.action.credential.store(authCredential)
    }
}

class ComponentEventHandler implements StoreComponentEventHandler {
    holder: PublisherHolder<StoreComponentState>

    constructor() {
        this.holder = { set: false }
    }

    onStateChange(pub: Publisher<StoreComponentState>): void {
        this.holder = { set: true, pub }
    }

    handleFetchEvent(_event: FetchEvent): void {
        // StoreComponent ではこのイベントは発生しない
    }
    handleRenewEvent(_event: RenewEvent): void {
        // StoreComponent ではこのイベントは発生しない
    }
    handleStoreEvent(event: StoreEvent): void {
        this.publish(event)
    }

    publish(state: StoreComponentState): void {
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
