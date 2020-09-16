import { Infra } from "../infra"

import { CredentialAction, CredentialEventHandler, RenewResult, RenewEventPublisher, StoreEventPublisher } from "../action"

import { AuthCredential, TicketNonce } from "../data"

export function initCredentialAction(handler: CredentialEventHandler, infra: Infra): CredentialAction {
    return new Action(handler, infra)
}

class Action implements CredentialAction {
    handler: CredentialEventHandler
    infra: Infra

    constructor(handler: CredentialEventHandler, infra: Infra) {
        this.handler = handler
        this.infra = infra
    }

    async fetch(): Promise<void> {
        const found = this.infra.authCredentials.findTicketNonce()
        if (!found.success) {
            this.handler.handleFetchEvent({ type: "failed-to-fetch", err: found.err })
            return
        }
        if (!found.found) {
            this.handler.handleFetchEvent({ type: "failed-to-fetch", err: { type: "ticket-nonce-not-found" } })
            return
        }
        this.handler.handleFetchEvent({ type: "succeed-to-fetch", ticketNonce: found.ticketNonce })
    }
    async renew(ticketNonce: TicketNonce): Promise<void> {
        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await delayed(
            this.infra.renewClient.renew(ticketNonce),
            this.infra.config.renewDelayTime,
            () => this.handler.handleRenewEvent({ type: "delayed-to-renew" }),
        )
        if (!response.success) {
            this.handler.handleRenewEvent({ type: "failed-to-renew", err: response.err })
            return
        }
        this.handler.handleRenewEvent({ type: "succeed-to-renew", authCredential: response.authCredential })
    }
    async store(authCredential: AuthCredential): Promise<void> {
        const response = this.infra.authCredentials.storeAuthCredential(authCredential)
        if (!response.success) {
            this.handler.handleStoreEvent({ type: "failed-to-store", err: response.err })
            return
        }
        this.handler.handleStoreEvent({ type: "succeed-to-store" })
    }

    async renewDeprecated(event: RenewEventPublisher): Promise<RenewResult> {
        const findResponse = this.infra.authCredentials.findTicketNonce()
        if (!findResponse.success) {
            event.failedToRenew(findResponse.err)
            return { success: false }
        }

        if (!findResponse.found) {
            event.failedToRenew({ type: "ticket-nonce-not-found" })
            return { success: false }
        }

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const promise = this.infra.renewClient.renew(findResponse.ticketNonce)
        const response = await delayed(promise, this.infra.config.renewDelayTime, event.delayedToRenew)
        if (!response.success) {
            event.failedToRenew(response.err)
            return { success: false }
        }

        return { success: true, authCredential: response.authCredential }
    }

    async storeDeprecated(event: StoreEventPublisher, authCredential: AuthCredential): Promise<void> {
        const response = this.infra.authCredentials.storeAuthCredential(authCredential)
        if (!response.success) {
            event.failedToStore(response.err)
            return
        }

        event.succeedToStore()
    }
}

async function delayed<T>(promise: Promise<T>, time: DelayTime, handler: DelayedHandler): Promise<T> {
    const DELAYED_MARKER = { DELAYED: true }
    const delayed = new Promise((resolve) => {
        setTimeout(() => {
            resolve(DELAYED_MARKER)
        }, time.delay_milli_second)
    })

    const winner = await Promise.race([promise, delayed])
    if (winner === DELAYED_MARKER) {
        handler()
    }

    return await promise
}

type DelayTime = { delay_milli_second: number }

interface DelayedHandler {
    (): void
}
