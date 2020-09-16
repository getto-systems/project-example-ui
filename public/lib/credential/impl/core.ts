import { Infra } from "../infra"

import { CredentialAction, CredentialEventHandler, StoreEventPublisher } from "../action"

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
            this.handler.handleFetchEvent({ type: "require-login" })
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
        if (!response.hasCredential) {
            this.handler.handleRenewEvent({ type: "require-login" })
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
