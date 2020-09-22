import { Infra } from "../infra"

import {
    CredentialAction,
    CredentialEventPublisher,
    CredentialEventSubscriber,
    StoreEventPublisher,
} from "../action"

import { AuthCredential, TicketNonce, FetchEvent, RenewEvent, StoreEvent } from "../data"

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

    async fetch(): Promise<void> {
        const found = this.infra.authCredentials.findTicketNonce()
        if (!found.success) {
            this.pub.publishFetchEvent({ type: "failed-to-fetch", err: found.err })
            return
        }
        if (!found.found) {
            this.pub.publishFetchEvent({ type: "unauthorized" })
            return
        }
        this.pub.publishFetchEvent({ type: "succeed-to-fetch", ticketNonce: found.ticketNonce })
    }

    async renew(ticketNonce: TicketNonce): Promise<void> {
        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await delayed(
            this.infra.renewClient.renew(ticketNonce),
            this.infra.timeConfig.renewDelayTime,
            () => this.pub.publishRenewEvent({ type: "delayed-to-renew" }),
        )
        if (!response.success) {
            this.pub.publishRenewEvent({ type: "failed-to-renew", err: response.err })
            return
        }
        if (!response.hasCredential) {
            this.pub.publishRenewEvent({ type: "unauthorized" })
            return
        }
        this.pub.publishRenewEvent({ type: "succeed-to-renew", authCredential: response.authCredential })
    }

    async store(authCredential: AuthCredential): Promise<void> {
        const response = this.infra.authCredentials.storeAuthCredential(authCredential)
        if (!response.success) {
            this.pub.publishStoreEvent({ type: "failed-to-store", err: response.err })
            return
        }
        this.pub.publishStoreEvent({ type: "succeed-to-store" })
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

class EventPubSub implements CredentialEventPublisher, CredentialEventSubscriber {
    listener: {
        fetch: Publisher<FetchEvent>[]
        renew: Publisher<RenewEvent>[]
        store: Publisher<StoreEvent>[]
    }

    constructor() {
        this.listener = {
            fetch: [],
            renew: [],
            store: [],
        }
    }

    onFetch(pub: Publisher<FetchEvent>): void {
        this.listener.fetch.push(pub)
    }
    onRenew(pub: Publisher<RenewEvent>): void {
        this.listener.renew.push(pub)
    }
    onStore(pub: Publisher<StoreEvent>): void {
        this.listener.store.push(pub)
    }

    publishFetchEvent(event: FetchEvent): void {
        this.listener.fetch.forEach(pub => pub(event))
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
