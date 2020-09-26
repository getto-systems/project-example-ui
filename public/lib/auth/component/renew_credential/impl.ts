import {
    RenewCredentialComponentAction,
    RenewCredentialComponent,
    RenewCredentialParam,
    RenewCredentialState,
    RenewCredentialOperation,
} from "../renew_credential/component"

import { TicketNonce, RenewEvent } from "../../../credential/data"

// Renew は unmount した後も interval を維持したいので worker にはしない
export function initRenewCredentialComponent(action: RenewCredentialComponentAction): RenewCredentialComponent {
    return new Component(action)
}

export function packRenewCredentialParam(ticketNonce: TicketNonce): RenewCredentialParam {
    return { ticketNonce } as RenewCredentialParam & Param
}

function unpackRenewCredentialParam(param: RenewCredentialParam): Param {
    return param as unknown as Param
}

type Param = {
    ticketNonce: TicketNonce
}

class Component implements RenewCredentialComponent {
    action: RenewCredentialComponentAction
    listener: Post<RenewCredentialState>[]

    param: ParamHolder<Param>

    constructor(action: RenewCredentialComponentAction) {
        this.action = action
        this.action.credential.sub.onRenew((event) => {
            const state = mapEvent(event)
            this.listener.forEach(post => post(state))
        })

        this.listener = []
        this.param = { set: false }
    }

    onStateChange(stateChanged: Post<RenewCredentialState>): void {
        this.listener.push(stateChanged)
    }

    init(): Terminate {
        return () => this.terminate()
    }
    terminate(): void {
        // WorkerComponent とインターフェイスを合わせるために必要
    }

    trigger(operation: RenewCredentialOperation): Promise<void> {
        switch (operation.type) {
            case "set-param":
                return this.setParam(operation.param)

            case "renew":
                return this.action.credential.renew(unwrap(this.param).ticketNonce)

            case "set-renew-interval":
                return this.action.credential.setRenewInterval(operation.ticketNonce)
        }
    }

    async setParam(param: RenewCredentialParam): Promise<void> {
        this.param = { set: true, param: unpackRenewCredentialParam(param) }
    }
}

function mapEvent(event: RenewEvent): RenewCredentialState {
    return event
}

interface Post<T> {
    (state: T): void
}

type ParamHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, param: Readonly<T> }>

function unwrap<T>(param: ParamHolder<T>): Readonly<T> {
    if (!param.set) {
        throw new Error("not initialized")
    }
    return param.param
}

interface Terminate {
    (): void
}
