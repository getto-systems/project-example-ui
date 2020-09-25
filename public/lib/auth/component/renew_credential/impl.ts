import {
    RenewCredentialComponentAction,
    RenewCredentialComponent,
    RenewCredentialState,
} from "../renew_credential"

import { RenewEvent, StoreEvent } from "../../../credential/data"

export function initRenewCredentialComponent(action: RenewCredentialComponentAction): RenewCredentialComponent {
    return new Component(action)
}

class Component implements RenewCredentialComponent {
    listener: Post<RenewCredentialState>[]
    action: RenewCredentialComponentAction

    constructor(action: RenewCredentialComponentAction) {
        this.listener = []
        this.action = action
    }

    hook(post: Post<RenewCredentialState>): void {
        this.listener.push(post)
    }
    onStateChange(stateChanged: Post<RenewCredentialState>): void {
        this.action.credential.sub.onRenew((event) => {
            const state = map(event)
            this.listener.forEach(post => post(state))
            stateChanged(state)
        })

        function map(event: RenewEvent | StoreEvent): RenewCredentialState {
            return event
        }
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }

    renew(): Promise<void> {
        return this.action.credential.renew()
    }
}

interface Post<T> {
    (state: T): void
}
