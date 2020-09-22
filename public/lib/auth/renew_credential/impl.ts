import { RenewCredentialComponent, RenewCredentialComponentAction } from "./component"

import { RenewCredentialState } from "./data"

import { TicketNonce, RenewEvent } from "../../credential/data"

export function initRenewCredentialComponent(action: RenewCredentialComponentAction): RenewCredentialComponent {
    return new Component(action)
}

class Component implements RenewCredentialComponent {
    listener: Publisher<RenewCredentialState>[]
    action: RenewCredentialComponentAction

    constructor(action: RenewCredentialComponentAction) {
        this.listener = []
        this.action = action
    }

    hook(pub: Publisher<RenewCredentialState>): void {
        this.listener.push(pub)
    }
    init(stateChanged: Publisher<RenewCredentialState>): void {
        this.action.credential.sub.onRenew((event) => {
            const state = map(event)
            this.listener.forEach(pub => pub(state))
            stateChanged(state)
        })

        function map(event: RenewEvent): RenewCredentialState {
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

interface Publisher<T> {
    (state: T): void
}
