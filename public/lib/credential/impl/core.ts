import { Infra } from "../infra"

import {
    CredentialAction,
    CredentialEventPublisher,
    CredentialEventSubscriber,
} from "../action"

import { AuthResource, AuthCredential, TicketNonce, RenewEvent, StoreEvent, FetchResponse } from "../data"

export function initCredentialAction(infra: Infra): CredentialAction {
    return new Action(infra)
}

class Action implements CredentialAction {
    infra: Infra

    pub: CredentialEventPublisher
    sub: CredentialEventSubscriber

    isLoaded = false

    constructor(infra: Infra) {
        this.infra = infra

        const pubsub = new EventPubSub()
        this.pub = pubsub
        this.sub = pubsub
    }

    fetch(): FetchResponse {
        const ticketNonce = this.infra.authCredentials.findTicketNonce()
        if (!ticketNonce.success) {
            return { success: false, err: ticketNonce.err }
        }
        if (!ticketNonce.found) {
            return { success: true, found: false }
        }

        const lastAuthAt = this.infra.authCredentials.findLastAuthAt()
        if (!lastAuthAt.success) {
            return { success: false, err: lastAuthAt.err }
        }
        if (!lastAuthAt.found) {
            return { success: true, found: false }
        }

        return {
            success: true,
            found: true,
            content: {
                ticketNonce: ticketNonce.content,
                lastAuthAt: lastAuthAt.content,
            },
        }
    }

    async renew(fetchResponse: FetchResponse): Promise<void> {
        const post = (event: RenewEvent) => this.pub.postRenewEvent(event)

        if (!fetchResponse.success) {
            post({ type: "failed-to-fetch", err: fetchResponse.err })
            return
        }
        if (!fetchResponse.found) {
            post({ type: "required-to-login" })
            return
        }

        if (!this.infra.expires.hasExceeded(fetchResponse.content.lastAuthAt, this.infra.timeConfig.instantLoadExpireTime)) {
            post({ type: "try-to-instant-load" })
            return
        }

        post({ type: "try-to-renew" })

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const renewResponse = await this.infra.delayed(
            this.infra.renewClient.renew(fetchResponse.content.ticketNonce),
            this.infra.timeConfig.renewDelayTime,
            () => post({ type: "delayed-to-renew" }),
        )
        if (!renewResponse.success) {
            post({ type: "failed-to-renew", err: renewResponse.err })
            return
        }
        if (!renewResponse.hasCredential) {
            post({ type: "required-to-login" })
            return
        }

        const storeResponse = this.infra.authCredentials.storeAuthCredential(renewResponse.authCredential)
        if (!storeResponse.success) {
            post({ type: "failed-to-store", err: storeResponse.err })
            return
        }

        post({ type: "succeed-to-renew" })
    }

    async storeCredential(authCredential: AuthCredential): Promise<void> {
        const post = (event: StoreEvent) => this.pub.postStoreEvent(event)

        const storeResponse = this.infra.authCredentials.storeAuthCredential(authCredential)
        if (!storeResponse.success) {
            post({ type: "failed-to-store", err: storeResponse.err })
            return
        }
    }

    setContinuousRenew(authResource: AuthResource): void {
        setTimeout(async () => {
            if (await this.continuousRenew(authResource.ticketNonce)) {
                let lastState = true
                setInterval(async () => {
                    // 失敗しないはずなので clearInterval しない
                    if (lastState) {
                        lastState = await this.continuousRenew(authResource.ticketNonce)
                    }
                }, this.infra.timeConfig.renewIntervalTime.interval_milli_second)
            }
        }, this.infra.runner.nextRun(authResource.lastAuthAt, this.infra.timeConfig.renewRunDelayTime).delay_milli_second)
    }
    async continuousRenew(ticketNonce: TicketNonce): Promise<boolean> {
        // 画面へのフィードバックはしないので、イベントは発行しない
        const renewResponse = await this.infra.renewClient.renew(ticketNonce)
        if (!renewResponse.success) {
            return false
        }
        if (!renewResponse.hasCredential) {
            return false
        }

        const storeResponse = this.infra.authCredentials.storeAuthCredential(renewResponse.authCredential)
        if (!storeResponse.success) {
            return false
        }

        return true
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

    onRenewEvent(post: Post<RenewEvent>): void {
        this.listener.renew.push(post)
    }
    onStoreEvent(post: Post<StoreEvent>): void {
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
