import {
    RenewCredentialComponentAction,
    RenewCredentialComponent,
    RenewCredentialState,
    RenewCredentialOperation,
} from "../renew_credential/component"

import { RenewEvent, StoreEvent } from "../../../credential/data"

export function initRenewCredentialComponent(action: RenewCredentialComponentAction): RenewCredentialComponent {
    return new Component(action)
}

class Component implements RenewCredentialComponent {
    action: RenewCredentialComponentAction
    listener: Post<RenewCredentialState>[]

    constructor(action: RenewCredentialComponentAction) {
        this.action = action
        this.action.credential.sub.onRenew((event) => {
            const state = mapEvent(event)
            this.listener.forEach(post => post(state))
        })

        this.listener = []
    }

    onStateChange(stateChanged: Post<RenewCredentialState>): void {
        this.listener.push(stateChanged)
    }

    init(): void {
        // WorkerComponent とインターフェイスを合わせるために必要
    }
    terminate(): void {
        // WorkerComponent とインターフェイスを合わせるために必要
    }

    trigger(_operation: RenewCredentialOperation): Promise<void> {
        return this.action.credential.renew()
    }
}

function mapEvent(event: RenewEvent | StoreEvent): RenewCredentialState {
    return event
}

interface Post<T> {
    (state: T): void
}
