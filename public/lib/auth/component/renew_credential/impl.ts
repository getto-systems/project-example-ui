import { unpackRenewCredentialParam } from "./param"

import {
    RenewCredentialComponentAction,
    RenewCredentialComponent,
    RenewCredentialState,
    RenewCredentialOperation,
} from "../renew_credential/component"

import { RenewEvent } from "../../../credential/data"

// Renew は unmount した後も interval を維持したいので worker にはしない
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

    trigger(operation: RenewCredentialOperation): Promise<void> {
        switch (operation.type) {
            case "renew":
                return this.action.credential.renew(unpackRenewCredentialParam(operation.param).ticketNonce)

            case "set-renew-interval":
                return this.action.credential.setRenewInterval(operation.ticketNonce)
        }
    }
}

function mapEvent(event: RenewEvent): RenewCredentialState {
    return event
}

interface Post<T> {
    (state: T): void
}
