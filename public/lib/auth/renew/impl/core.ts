import {
    RenewComponentAction,
    RenewComponentDeprecated,
    RenewComponentState,
    RenewComponentEventPublisher,
    RenewComponentEventInit,
    RenewComponentStateHandler,
} from "../action"

import { AuthComponentEventHandler } from "../../../auth/data"

import { RenewError, StoreError } from "../../../credential/data"

export function initRenewComponentDeprecated(action: RenewComponentAction): RenewComponentDeprecated {
    return new ComponentDeprecated(action)
}
export function initRenewComponentEvent(authEvent: AuthComponentEventHandler): RenewComponentEventInit {
    return (stateChanged) => new ComponentEvent(authEvent, stateChanged)
}

class ComponentDeprecated implements RenewComponentDeprecated {
    action: RenewComponentAction

    initialState: RenewComponentState = { type: "initial-renew" }

    constructor(action: RenewComponentAction) {
        this.action = action
    }

    async renew(event: RenewComponentEventPublisher): Promise<void> {
        const result = await this.action.credential.renew(event)
        if (!result.success) {
            return
        }

        await this.action.credential.store(event, result.authCredential)
    }
}

class ComponentEvent implements RenewComponentEventPublisher {
    authEvent: AuthComponentEventHandler
    stateChanged: RenewComponentStateHandler

    constructor(authEvent: AuthComponentEventHandler, stateChanged: RenewComponentStateHandler) {
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
                this.authEvent.handleAuthEvent({ type: "try-to-login" })
                return

            case "bad-request":
            case "server-error":
            case "bad-response":
            case "infra-error":
                this.authEvent.handleAuthEvent({ type: "failed-to-login", err: { type: "renew", err } })
                return

            default:
                return assertNever(err)
        }
    }

    failedToStore(err: StoreError): void {
        this.stateChanged({ type: "failed-to-store", err })
    }
    succeedToStore(): void {
        this.authEvent.handleAuthEvent({ type: "succeed-to-login" })
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
