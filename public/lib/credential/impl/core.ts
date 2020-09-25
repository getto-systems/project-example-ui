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
        const post = (event: RenewEvent) => this.pub.postRenewEvent(event)

        const found = this.infra.authCredentials.findTicketNonce()
        if (!found.success) {
            post({ type: "failed-to-fetch", err: found.err })
            return
        }
        if (!found.found) {
            post({ type: "required-to-login" })
            return
        }

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await delayed(
            this.infra.renewClient.renew(found.ticketNonce),
            this.infra.timeConfig.renewDelayTime,
            () => post({ type: "delayed-to-renew" }),
        )
        if (!response.success) {
            post({ type: "failed-to-renew", err: response.err })
            return
        }
        if (!response.hasCredential) {
            post({ type: "required-to-login" })
            return
        }

        this.store(response.authCredential)
    }

    async store(authCredential: AuthCredential): Promise<void> {
        const post = (event: StoreEvent) => this.pub.postStoreEvent(event)

        const response = this.infra.authCredentials.storeAuthCredential(authCredential)
        if (!response.success) {
            post({ type: "failed-to-store", err: response.err })
            return
        }
        post({ type: "succeed-to-store" })

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
        renew: Post<RenewEvent>[]
        store: Post<StoreEvent>[]
    }

    constructor() {
        this.listener = {
            renew: [],
            store: [],
        }
    }

    onRenew(post: Post<RenewEvent | StoreEvent>): void {
        // renew は同時に store も呼び出す
        this.listener.renew.push(post)
        this.listener.store.push(post)
    }
    onStore(post: Post<StoreEvent>): void {
        this.listener.store.push(post)
    }

    postRenewEvent(event: RenewEvent): void {
        this.listener.renew.forEach(post => post(event))
    }
    postStoreEvent(event: StoreEvent): void {
        this.listener.store.forEach(post => post(event))
    }
}

interface Post<T> {
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
