import { AuthComponentEvent } from "../../../auth/action"
import {
    RenewComponentAction,
    RenewComponent,
    RenewComponentState,
    RenewComponentEvent,
    RenewComponentEventInit,
    RenewComponentStateHandler,
} from "../action"

import { RenewError, StoreError } from "../../../credential/data"

export function initRenewComponent(action: RenewComponentAction): RenewComponent {
    return new Component(action)
}
export function initRenewComponentEvent(authEvent: AuthComponentEvent): RenewComponentEventInit {
    return (stateChanged) => new ComponentEvent(authEvent, stateChanged)
}

class Component implements RenewComponent {
    action: RenewComponentAction

    initialState: RenewComponentState = { type: "initial-renew" }

    constructor(action: RenewComponentAction) {
        this.action = action
    }

    async renew(event: RenewComponentEvent): Promise<void> {
        const result = await this.action.credential.renew(event)
        if (!result.success) {
            return
        }

        await this.action.credential.store(event, result.authCredential)
    }
}

class ComponentEvent implements RenewComponentEvent {
    authEvent: AuthComponentEvent
    stateChanged: RenewComponentStateHandler

    constructor(authEvent: AuthComponentEvent, stateChanged: RenewComponentStateHandler) {
        this.authEvent = authEvent
        this.stateChanged = stateChanged
    }

    tryToRenew(): void {
        this.stateChanged({ type: "try-to-renew" })
    }
    delayedToRenew(): void {
        this.stateChanged({ type: "delayed-to-renew" })
    }
    failedToRenew(err: RenewError): void {
        switch (err.type) {
            case "ticket-nonce-not-found":
            case "invalid-ticket":
                this.authEvent.tryToLogin()
                return

            case "bad-request":
            case "server-error":
            case "bad-response":
            case "infra-error":
                this.authEvent.failedToAuth({ type: "renew", err })
                return

            default:
                return assertNever(err)
        }
    }

    failedToStore(err: StoreError): void {
        this.stateChanged({ type: "failed-to-store", err })
    }
    succeedToStore(): void {
        this.authEvent.succeedToAuth()
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
