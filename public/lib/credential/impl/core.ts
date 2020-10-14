import { RenewInfra, StoreInfra } from "../infra"

import {
    RenewFactory, RenewAction,
    StoreFactory, StoreAction,
} from "../action"

import { TicketNonce, RenewEvent, StoreEvent, FetchResponse } from "../data"

const renewAction = (infra: RenewInfra, post: Post<RenewEvent>): RenewAction => {
    return {
        renew,
        setContinuousRenew,
    }

    async function renew() {
        const lastAuth = fetchLastAuth()
        if (!lastAuth.success) {
            post({ type: "failed-to-fetch", err: lastAuth.err })
            return
        }
        if (!lastAuth.found) {
            post({ type: "required-to-login" })
            return
        }

        if (!infra.expires.hasExceeded(lastAuth.content.lastAuthAt, infra.time.instantLoadExpireTime)) {
            post({ type: "try-to-instant-load" })
            return
        }

        post({ type: "try-to-renew" })

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const renewResponse = await infra.delayed(
            infra.renewClient.renew(lastAuth.content.ticketNonce),
            infra.time.renewDelayTime,
            () => post({ type: "delayed-to-renew" }),
        )
        if (!renewResponse.success) {
            post({ type: "failed-to-renew", err: renewResponse.err })
            return
        }
        if (!renewResponse.hasCredential) {
            const storeResponse = infra.authCredentials.removeAuthCredential()
            if (!storeResponse.success) {
                post({ type: "failed-to-store", err: storeResponse.err })
                return
            }

            post({ type: "required-to-login" })
            return
        }

        const storeResponse = infra.authCredentials.storeAuthCredential(renewResponse.authCredential)
        if (!storeResponse.success) {
            post({ type: "failed-to-store", err: storeResponse.err })
            return
        }

        post({ type: "succeed-to-renew" })
    }

    function setContinuousRenew(): void {
        const lastAuth = fetchLastAuth()
        if (!lastAuth.success) {
            post({ type: "failed-to-fetch", err: lastAuth.err })
            return
        }
        if (!lastAuth.found) {
            post({ type: "required-to-login" })
            return
        }

        const { ticketNonce, lastAuthAt } = lastAuth.content

        setTimeout(async () => {
            if (await continuousRenew(ticketNonce)) {
                let lastState = true
                setInterval(async () => {
                    // 失敗しないはずなので clearInterval しない
                    if (lastState) {
                        lastState = await continuousRenew(ticketNonce)
                    }
                }, infra.time.renewIntervalTime.interval_milli_second)
            }
        }, infra.runner.nextRun(lastAuthAt, infra.time.renewRunDelayTime).delay_milli_second)
    }
    async function continuousRenew(ticketNonce: TicketNonce): Promise<boolean> {
        // 画面へのフィードバックはしないので、イベントは発行しない
        const renewResponse = await infra.renewClient.renew(ticketNonce)
        if (!renewResponse.success) {
            return false
        }
        if (!renewResponse.hasCredential) {
            infra.authCredentials.removeAuthCredential()
            return false
        }

        const storeResponse = infra.authCredentials.storeAuthCredential(renewResponse.authCredential)
        if (!storeResponse.success) {
            return false
        }

        return true
    }

    function fetchLastAuth(): FetchResponse {
        const ticketNonce = infra.authCredentials.findTicketNonce()
        if (!ticketNonce.success) {
            return { success: false, err: ticketNonce.err }
        }
        if (!ticketNonce.found) {
            return { success: true, found: false }
        }

        const lastAuthAt = infra.authCredentials.findLastAuthAt()
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
}

export function initRenewFactory(infra: RenewInfra): RenewFactory {
    return () => {
        const pubsub = new RenewEventPubSub()
        return {
            action: renewAction(infra, event => pubsub.postRenewEvent(event)),
            subscriber: pubsub,
        }
    }
}

const storeAction = (infra: StoreInfra, post: Post<StoreEvent>): StoreAction => async (authCredential) => {
    const storeResponse = infra.authCredentials.storeAuthCredential(authCredential)
    if (!storeResponse.success) {
        post({ type: "failed-to-store", err: storeResponse.err })
        return
    }
}

export function initStoreFactory(infra: StoreInfra): StoreFactory {
    return () => {
        const pubsub = new StoreEventPubSub()
        return {
            action: storeAction(infra, event => pubsub.postStoreEvent(event)),
            subscriber: pubsub,
        }
    }
}

class RenewEventPubSub {
    renew: Post<RenewEvent>[] = []

    onRenewEvent(post: Post<RenewEvent>): void {
        this.renew.push(post)
    }
    postRenewEvent(event: RenewEvent): void {
        this.renew.forEach(post => post(event))
    }
}

class StoreEventPubSub {
    store: Post<StoreEvent>[] = []

    onStoreEvent(post: Post<StoreEvent>): void {
        this.store.push(post)
    }
    postStoreEvent(event: StoreEvent): void {
        this.store.forEach(post => post(event))
    }
}

interface Post<T> {
    (state: T): void
}
