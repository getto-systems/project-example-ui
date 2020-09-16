import { Infra } from "../infra"

import {
    RenewCredentialAction,
    RenewCredentialEventPublisher,
    RenewCredentialEventSubscriber,
} from "../action"

import { RenewCredentialEvent } from "../data"

import { TicketNonce } from "../../credential/data"

export function initRenewCredentialAction(infra: Infra): RenewCredentialAction {
    return new Action(infra)
}

class Action implements RenewCredentialAction {
    infra: Infra

    pub: RenewCredentialEventPublisher
    sub: RenewCredentialEventSubscriber

    constructor(infra: Infra) {
        this.infra = infra

        const pubsub = new EventPubSub()
        this.pub = pubsub
        this.sub = pubsub
    }

    async renewCredential(ticketNonce: TicketNonce): Promise<void> {
        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await delayed(
            this.infra.renewClient.renew(ticketNonce),
            this.infra.timeConfig.renewDelayTime,
            () => this.pub.publishRenewCredentialEvent({ type: "delayed-to-renew" }),
        )
        if (!response.success) {
            this.pub.publishRenewCredentialEvent({ type: "failed-to-renew", err: response.err })
            return
        }
        if (!response.hasCredential) {
            this.pub.publishRenewCredentialEvent({ type: "unauthorized" })
            return
        }
        this.pub.publishRenewCredentialEvent({ type: "succeed-to-renew", authCredential: response.authCredential })
    }
}

class EventPubSub implements RenewCredentialEventPublisher, RenewCredentialEventSubscriber {
    holder: {
        renew: PublisherHolder<RenewCredentialEvent>
    }

    constructor() {
        this.holder = {
            renew: { set: false },
        }
    }

    onRenewCredential(pub: Publisher<RenewCredentialEvent>): void {
        this.holder.renew = { set: true, pub }
    }

    publishRenewCredentialEvent(event: RenewCredentialEvent): void {
        if (this.holder.renew.set) {
            this.holder.renew.pub(event)
        }
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

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
