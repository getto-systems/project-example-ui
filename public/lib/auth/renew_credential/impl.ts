import { RenewCredentialComponent, RenewCredentialComponentAction } from "./component"

import { RenewCredentialState } from "./data"

import { RenewEvent } from "../../credential/data"

export function initRenewCredentialComponent(action: RenewCredentialComponentAction): RenewCredentialComponent {
    return new Component(action)
}

class Component implements RenewCredentialComponent {
    listener: Dispatcher<RenewCredentialState>[]
    action: RenewCredentialComponentAction

    constructor(action: RenewCredentialComponentAction) {
        this.listener = []
        this.action = action
    }

    hook(dispatch: Dispatcher<RenewCredentialState>): void {
        this.listener.push(dispatch)
    }
    onStateChange(stateChanged: Dispatcher<RenewCredentialState>): void {
        this.action.credential.sub.onRenew((event) => {
            const state = map(event)
            this.listener.forEach(dispatch => dispatch(state))
            stateChanged(state)
        })

        function map(event: RenewEvent): RenewCredentialState {
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

interface Dispatcher<T> {
    (state: T): void
}
