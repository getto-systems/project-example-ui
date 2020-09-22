import { FetchCredentialComponent, FetchCredentialComponentAction } from "./component"

import { FetchCredentialComponentState } from "./data"

import { FetchEvent } from "../../credential/data"

export function initFetchCredentialComponent(action: FetchCredentialComponentAction): FetchCredentialComponent {
    return new Component(action)
}

class Component implements FetchCredentialComponent {
    listener: Publisher<FetchCredentialComponentState>[]
    action: FetchCredentialComponentAction

    constructor(action: FetchCredentialComponentAction) {
        this.listener = []
        this.action = action
    }

    hook(pub: Publisher<FetchCredentialComponentState>): void {
        this.listener.push(pub)
    }
    init(stateChanged: Publisher<FetchCredentialComponentState>): void {
        this.action.credential.sub.onFetch((event) => {
            const state = map(event)
            this.listener.forEach(pub => pub(state))
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

interface Publisher<T> {
    (state: T): void
}
