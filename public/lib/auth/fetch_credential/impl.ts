import { FetchCredentialComponentAction } from "./component"

import { FetchCredentialComponent, FetchCredentialComponentState } from "./data"

import { FetchEvent } from "../../credential/data"

export function initFetchCredentialComponent(action: FetchCredentialComponentAction): FetchCredentialComponent {
    return new Component(action)
}

class Component implements FetchCredentialComponent {
    holder: PublisherHolder<FetchCredentialComponentState>
    action: FetchCredentialComponentAction

    constructor(action: FetchCredentialComponentAction) {
        this.holder = { set: false }
        this.action = action
    }

    hook(pub: Publisher<FetchCredentialComponentState>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<FetchCredentialComponentState>): void {
        this.action.credential.sub.onFetch((event) => {
            const state = map(event)
            if (this.holder.set) {
                this.holder.pub(state)
            }
            stateChanged(state)
        })

        function map(event: FetchEvent): FetchCredentialComponentState {
            return event
        }
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
    fetch(): Promise<void> {
        return this.action.credential.fetch()
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
