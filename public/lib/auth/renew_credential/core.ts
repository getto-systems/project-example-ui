import {
    RenewCredentialComponentAction,
} from "./action"

import {
    RenewCredentialComponent,
    RenewCredentialComponentState,
    RenewCredentialComponentOperation,
} from "./data"

import { TicketNonce } from "../../credential/data"
import { RenewCredentialEvent } from "../../renew_credential/data"

export function initRenewCredentialComponent(action: RenewCredentialComponentAction): RenewCredentialComponent {
    return new Component(action)
}

class Component implements RenewCredentialComponent {
    holder: PublisherHolder<RenewCredentialComponentState>
    action: RenewCredentialComponentAction

    constructor(action: RenewCredentialComponentAction) {
        this.holder = { set: false }
        this.action = action
    }

    hook(pub: Publisher<RenewCredentialComponentState>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<RenewCredentialComponentState>): void {
        this.action.renewCredential.sub.onRenewCredential((event) => {
            const state = map(event)
            if (this.holder.set) {
                this.holder.pub(state)
            }
            stateChanged(state)
        })

        function map(event: RenewCredentialEvent): RenewCredentialComponentState {
            return event
        }
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
    trigger(operation: RenewCredentialComponentOperation): Promise<void> {
        return this.renew(operation.ticketNonce)
    }

    renew(ticketNonce: TicketNonce): Promise<void> {
        return this.action.renewCredential.renewCredential(ticketNonce)
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
