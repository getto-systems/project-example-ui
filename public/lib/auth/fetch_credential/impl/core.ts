import { FetchCredentialComponentAction } from "../action"
import { CredentialEventSubscriber } from "../../../credential/action"

import { FetchCredentialComponent, FetchCredentialComponentState } from "../data"

import { FetchEvent } from "../../../credential/data"

export function initFetchCredentialComponent(
    sub: CredentialEventSubscriber,
    action: FetchCredentialComponentAction,
): FetchCredentialComponent {
    return new Component(sub, action)
}

class Component implements FetchCredentialComponent {
    holder: PublisherHolder<FetchEvent>
    sub: CredentialEventSubscriber
    action: FetchCredentialComponentAction

    constructor(sub: CredentialEventSubscriber, action: FetchCredentialComponentAction) {
        this.holder = { set: false }
        this.sub = sub
        this.action = action
    }

    hook(pub: Publisher<FetchEvent>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<FetchCredentialComponentState>): void {
        this.sub.onFetch((event) => {
            if (this.holder.set) {
                this.holder.pub(event)
            }
            stateChanged(map(event))
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
