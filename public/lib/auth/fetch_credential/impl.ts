import { FetchCredentialComponent, FetchCredentialComponentAction } from "./component"

import { FetchCredentialState } from "./data"

import { FetchEvent } from "../../credential/data"

export function initFetchCredentialComponent(action: FetchCredentialComponentAction): FetchCredentialComponent {
    return new Component(action)
}

class Component implements FetchCredentialComponent {
    listener: Publisher<FetchCredentialState>[]
    action: FetchCredentialComponentAction

    constructor(action: FetchCredentialComponentAction) {
        this.listener = []
        this.action = action
    }

    hook(pub: Publisher<FetchCredentialState>): void {
        this.listener.push(pub)
    }
    onStateChange(stateChanged: Publisher<FetchCredentialState>): void {
        this.action.credential.sub.onFetch((event) => {
            const state = map(event)
            this.listener.forEach(pub => pub(state))
            stateChanged(state)
        })

        function map(event: FetchEvent): FetchCredentialState {
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

interface Publisher<T> {
    (state: T): void
}
