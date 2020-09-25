import {
    StoreCredentialComponentAction,
    StoreCredentialComponent,
    StoreCredentialState,
} from "../store_credential/component"

import { AuthCredential, StoreEvent } from "../../../credential/data"

export function initStoreCredentialComponent(action: StoreCredentialComponentAction): StoreCredentialComponent {
    return new Component(action)
}

class Component implements StoreCredentialComponent {
    action: StoreCredentialComponentAction

    listener: Post<StoreCredentialState>[]

    constructor(action: StoreCredentialComponentAction) {
        this.action = action
        this.action.credential.sub.onStore((event) => {
            const state = mapEvent(event)
            this.listener.forEach(post => post(state))

        })

        this.listener = []
    }

    onStateChange(stateChanged: Post<StoreCredentialState>): void {
        this.listener.push(stateChanged)
    }

    init(): void {
        // WorkerComponent とインターフェイスを合わせるために必要
    }
    terminate(): void {
        // WorkerComponent とインターフェイスを合わせるために必要
    }
    store(authCredential: AuthCredential): Promise<void> {
        return this.action.credential.store(authCredential)
    }
}

function mapEvent(event: StoreEvent): StoreCredentialState {
    return event
}

interface Post<T> {
    (state: T): void
}
