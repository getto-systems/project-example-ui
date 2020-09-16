import { StoreCredentialComponentAction } from "./action"

import { StoreCredentialComponent, StoreCredentialComponentState } from "./data"

import { AuthCredential, StoreEvent } from "../../credential/data"

export function initStoreCredentialComponent(action: StoreCredentialComponentAction): StoreCredentialComponent {
    return new Component(action)
}

class Component implements StoreCredentialComponent {
    holder: PublisherHolder<StoreEvent>
    action: StoreCredentialComponentAction

    constructor(action: StoreCredentialComponentAction) {
        this.holder = { set: false }
        this.action = action
    }

    hook(pub: Publisher<StoreEvent>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<StoreCredentialComponentState>): void {
        this.action.credential.sub.onStore((event) => {
            if (this.holder.set) {
                this.holder.pub(event)
            }
            stateChanged(map(event))

            function map(event: StoreEvent): StoreCredentialComponentState {
                return event
            }
        })
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
    store(authCredential: AuthCredential): Promise<void> {
        return this.action.credential.store(authCredential)
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
