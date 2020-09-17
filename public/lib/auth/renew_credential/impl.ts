import { RenewCredentialComponent, RenewCredentialComponentAction } from "./component"

import { RenewCredentialComponentState } from "./data"

import { TicketNonce, RenewEvent } from "../../credential/data"

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
        this.action.credential.sub.onRenew((event) => {
            const state = map(event)
            if (this.holder.set) {
                this.holder.pub(state)
            }
            stateChanged(state)
        })

        function map(event: RenewEvent): RenewCredentialComponentState {
            return event
        }
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }

    renew(ticketNonce: TicketNonce): Promise<void> {
        return this.action.credential.renew(ticketNonce)
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
