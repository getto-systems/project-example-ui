import {
    RenewCredentialComponentAction,
} from "../action"

import { RenewCredentialEventSubscriber } from "../../../renew_credential/action"

import {
    RenewCredentialComponent,
    RenewCredentialComponentState,
    RenewCredentialComponentOperation,
} from "../data"

import { TicketNonce } from "../../../credential/data"
import { RenewCredentialEvent } from "../../../renew_credential/data"

export function initRenewCredentialComponent(
    sub: RenewCredentialEventSubscriber,
    action: RenewCredentialComponentAction,
): RenewCredentialComponent {
    return new Component(sub, action)
}

class Component implements RenewCredentialComponent {
    holder: PublisherHolder<RenewCredentialEvent>
    sub: RenewCredentialEventSubscriber
    action: RenewCredentialComponentAction

    constructor(sub: RenewCredentialEventSubscriber, action: RenewCredentialComponentAction) {
        this.holder = { set: false }
        this.sub = sub
        this.action = action
    }

    hook(pub: Publisher<RenewCredentialEvent>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<RenewCredentialComponentState>): void {
        this.sub.onRenewCredential((event) => {
            if (this.holder.set) {
                this.holder.pub(event)
            }
            stateChanged(map(event))
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
