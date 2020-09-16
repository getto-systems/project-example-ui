import { Infra } from "../infra"

import {
    CredentialAction,
    CredentialEventPubSub,
    CredentialEventPublisher,
    CredentialEventSubscriber,
    StoreEventPublisher,
} from "../action"

import { FetchEvent, StoreEvent } from "../data"

import { AuthCredential } from "../data"

export function initCredentialAction(pub: CredentialEventPublisher, infra: Infra): CredentialAction {
    return new Action(pub, infra)
}
export function initCredentialEventPubSub(): CredentialEventPubSub {
    const pubsub = new EventPubSub()
    return [pubsub, pubsub]
}

class Action implements CredentialAction {
    pub: CredentialEventPublisher
    infra: Infra

    constructor(pub: CredentialEventPublisher, infra: Infra) {
        this.pub = pub
        this.infra = infra
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
    holder: {
        fetch: PublisherHolder<FetchEvent>
        store: PublisherHolder<StoreEvent>
    }

    constructor() {
        this.holder = {
            fetch: { set: false },
            store: { set: false },
        }
    }

    onFetch(pub: Publisher<FetchEvent>): void {
        this.holder.fetch = { set: true, pub }
    }
    onStore(pub: Publisher<StoreEvent>): void {
        this.holder.store = { set: true, pub }
    }

    publishFetchEvent(event: FetchEvent): void {
        if (this.holder.fetch.set) {
            this.holder.fetch.pub(event)
        }
    }
    publishStoreEvent(event: StoreEvent): void {
        if (this.holder.store.set) {
            this.holder.store.pub(event)
        }
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
