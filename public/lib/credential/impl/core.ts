import { Infra } from "../infra"

import {
    CredentialAction,
    CredentialEventPublisher,
    CredentialEventSubscriber,
} from "../action"

import { AuthCredential, TicketNonce, RenewEvent, StoreEvent } from "../data"

export function initCredentialAction(infra: Infra): CredentialAction {
    return new Action(infra)
}

class Action implements CredentialAction {
    infra: Infra

    pub: CredentialEventPublisher
    sub: CredentialEventSubscriber

    constructor(infra: Infra) {
        this.infra = infra

        const pubsub = new EventPubSub()
        this.pub = pubsub
        this.sub = pubsub
    }

    async renew(): Promise<void> {
        const found = this.infra.authCredentials.findTicketNonce()
        if (!found.success) {
            this.pub.publishRenewEvent({ type: "failed-to-fetch", err: found.err })
            return
        }
        if (!found.found) {
            this.pub.publishRenewEvent({ type: "required-to-login" })
            return
        }

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const renewResponse = await delayed(
            this.infra.renewClient.renew(found.ticketNonce),
            this.infra.timeConfig.renewDelayTime,
            () => this.pub.publishRenewEvent({ type: "delayed-to-renew" }),
        )
        if (!renewResponse.success) {
            this.pub.publishRenewEvent({ type: "failed-to-renew", err: renewResponse.err })
            return
        }
        if (!renewResponse.hasCredential) {
            this.pub.publishRenewEvent({ type: "required-to-login" })
            return
        }

        const storeResponse = this.infra.authCredentials.storeAuthCredential(renewResponse.authCredential)
        if (!storeResponse.success) {
            this.pub.publishRenewEvent({ type: "failed-to-store", err: storeResponse.err })
            return
        }

        this.pub.publishRenewEvent({ type: "succeed-to-renew" })

        this.setRenewInterval(found.ticketNonce)
    }

    async store(authCredential: AuthCredential): Promise<void> {
        const response = this.infra.authCredentials.storeAuthCredential(authCredential)
        if (!response.success) {
            this.pub.publishStoreEvent({ type: "failed-to-store", err: response.err })
            return
        }
        this.pub.publishStoreEvent({ type: "succeed-to-store" })

        this.setRenewInterval(authCredential.ticketNonce)
    }

    setRenewInterval(ticketNonce: TicketNonce): void {
        let continueInterval = true
        setInterval(async () => {
            if (!continueInterval) {
                return
            }

            const renewResponse = await this.infra.renewClient.renew(ticketNonce)
            if (!renewResponse.success || !renewResponse.hasCredential) {
                continueInterval = false
                return
            }

            const storeResponse = this.infra.authCredentials.storeAuthCredential(renewResponse.authCredential)
            if (!storeResponse.success) {
                continueInterval = false
                return
            }
        }, this.infra.timeConfig.renewIntervalTime.interval_milli_second)
    }
}

class EventPubSub implements CredentialEventPublisher, CredentialEventSubscriber {
    listener: {
        renew: Publisher<RenewEvent>[]
        store: Publisher<StoreEvent>[]
    }

    constructor() {
        this.listener = {
            renew: [],
            store: [],
        }
    }

    onRenew(pub: Publisher<RenewEvent>): void {
        this.listener.renew.push(pub)
    }
    onStore(pub: Publisher<StoreEvent>): void {
        this.listener.store.push(pub)
    }

    publishRenewEvent(event: RenewEvent): void {
        this.listener.renew.forEach(pub => pub(event))
    }
    publishStoreEvent(event: StoreEvent): void {
        this.listener.store.forEach(pub => pub(event))
    }
}

interface Publisher<T> {
    (state: T): void
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
