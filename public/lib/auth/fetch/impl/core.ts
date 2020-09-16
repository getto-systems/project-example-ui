import { FetchComponentAction } from "../action"

import { FetchComponent, FetchComponentState, FetchComponentEventHandler } from "../data"

import { FetchEvent, RenewEvent, StoreEvent } from "../../../credential/data"

export function initFetchComponent(handler: FetchComponentEventHandler, action: FetchComponentAction): FetchComponent {
    return new Component(handler, action)
}
export function initFetchComponentEventHandler(): FetchComponentEventHandler {
    return new ComponentEventHandler()
}

class Component implements FetchComponent {
    handler: FetchComponentEventHandler
    action: FetchComponentAction

    constructor(handler: FetchComponentEventHandler, action: FetchComponentAction) {
        this.handler = handler
        this.action = action
    }

    init(stateChanged: Publisher<FetchComponentState>): void {
        this.handler.onStateChange(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
    fetch(): Promise<void> {
        return this.action.credential.fetch()
    }
}

class ComponentEventHandler implements FetchComponentEventHandler {
    holder: PublisherHolder<FetchComponentState>

    constructor() {
        this.holder = { set: false }
    }

    onStateChange(pub: Publisher<FetchComponentState>): void {
        this.holder = { set: true, pub }
    }

    handleFetchEvent(event: FetchEvent): void {
        this.publish(event)
    }
    handleRenewEvent(_event: RenewEvent): void {
        // FetchComponent ではこのイベントは発生しない
    }
    handleStoreEvent(_event: StoreEvent): void {
        // FetchComponent ではこのイベントは発生しない
    }

    publish(state: FetchComponentState): void {
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
