import { Infra } from "../infra"

import {
    CredentialAction,
    CredentialEventPublisher,
    CredentialEventSubscriber,
} from "../action"

import { TicketNonce, RenewEvent } from "../data"

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

    async renew(ticketNonce: TicketNonce): Promise<void> {
        const post = (event: RenewEvent) => this.pub.postRenewEvent(event)

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await delayed(
            this.infra.renewClient.renew(ticketNonce),
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

        post({ type: "succeed-to-renew", authCredential: response.authCredential })
    }

    async setRenewInterval(ticketNonce: TicketNonce): Promise<void> {
        const post = (event: RenewEvent) => this.pub.postRenewEvent(event)

        let continueInterval = true
        setInterval(async () => {
            // unmount したあとに実行されるので、失敗イベントは発行しない
            if (!continueInterval) {
                return
            }

            const response = await this.infra.renewClient.renew(ticketNonce)
            if (!response.success || !response.hasCredential) {
                continueInterval = false
                return
            }

            post({ type: "succeed-to-renew-interval", authCredential: response.authCredential })
        }, this.infra.timeConfig.renewIntervalTime.interval_milli_second)
    }
}

class EventPubSub implements CredentialEventPublisher, CredentialEventSubscriber {
    listener: {
        renew: Post<RenewEvent>[]
    }

    constructor() {
        this.listener = {
            renew: [],
        }
    }

    onRenew(post: Post<RenewEvent>): void {
        this.listener.renew.push(post)
    }

    postRenewEvent(event: RenewEvent): void {
        this.listener.renew.forEach(post => post(event))
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
