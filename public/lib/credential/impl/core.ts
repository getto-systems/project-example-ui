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
        const dispatch = (event: RenewEvent) => this.pub.dispatchRenewEvent(event)

        const found = this.infra.authCredentials.findTicketNonce()
        if (!found.success) {
            dispatch({ type: "failed-to-fetch", err: found.err })
            return
        }
        if (!found.found) {
            dispatch({ type: "required-to-login" })
            return
        }

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const response = await delayed(
            this.infra.renewClient.renew(found.ticketNonce),
            this.infra.timeConfig.renewDelayTime,
            () => dispatch({ type: "delayed-to-renew" }),
        )
        if (!response.success) {
            dispatch({ type: "failed-to-renew", err: response.err })
            return
        }
        if (!response.hasCredential) {
            dispatch({ type: "required-to-login" })
            return
        }

        this.store(response.authCredential)
    }

    async store(authCredential: AuthCredential): Promise<void> {
        const dispatch = (event: StoreEvent) => this.pub.dispatchStoreEvent(event)

        const response = this.infra.authCredentials.storeAuthCredential(authCredential)
        if (!response.success) {
            dispatch({ type: "failed-to-store", err: response.err })
            return
        }
        dispatch({ type: "succeed-to-store" })

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
        renew: Dispatcher<RenewEvent>[]
        store: Dispatcher<StoreEvent>[]
    }

    constructor() {
        this.listener = {
            renew: [],
            store: [],
        }
    }

    onRenew(dispatch: Dispatcher<RenewEvent>): void {
        this.listener.renew.push(dispatch)
    }
    onStore(dispatch: Dispatcher<StoreEvent>): void {
        this.listener.store.push(dispatch)
    }

    dispatchRenewEvent(event: RenewEvent): void {
        this.listener.renew.forEach(dispatch => dispatch(event))
    }
    dispatchStoreEvent(event: StoreEvent): void {
        this.listener.store.forEach(dispatch => dispatch(event))
    }
}

interface Dispatcher<T> {
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
