import { StoreCredentialComponent, StoreCredentialComponentAction } from "./component"

import { StoreCredentialState } from "./data"

import { AuthCredential, StoreEvent } from "../../credential/data"

export function initStoreCredentialComponent(action: StoreCredentialComponentAction): StoreCredentialComponent {
    return new Component(action)
}

class Component implements StoreCredentialComponent {
    listener: Post<StoreCredentialState>[]
    action: StoreCredentialComponentAction

    constructor(action: StoreCredentialComponentAction) {
        this.listener = []
        this.action = action
    }

    hook(post: Post<StoreCredentialState>): void {
        this.listener.push(post)
    }
    onStateChange(stateChanged: Post<StoreCredentialState>): void {
        this.action.credential.sub.onStore((event) => {
            const state = map(event)
            this.listener.forEach(post => post(state))
            stateChanged(state)

            function map(event: StoreEvent): StoreCredentialState {
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

interface Post<T> {
    (state: T): void
}
