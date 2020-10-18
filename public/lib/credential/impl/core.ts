import { RenewInfra, SetContinuousRenewInfra, StoreInfra, AuthCredentialRepository } from "../infra"

import {
    RenewAction,
    SetContinuousRenewAction,
    StoreAction,
} from "../action"

import { TicketNonce, FoundLastAuth } from "../data"

const renewAction = ({ authCredentials, client, expires, time, delayed }: RenewInfra): RenewAction => async (post) => {
    const lastAuth = findLastAuth(authCredentials)
    if (!lastAuth.success) {
        post({ type: "storage-error", err: lastAuth.err })
        return
    }
    if (!lastAuth.found) {
        post({ type: "required-to-login" })
        return
    }

    if (!expires.hasExceeded(lastAuth.content.lastAuthAt, time.instantLoadExpireTime)) {
        post({ type: "try-to-instant-load" })
        return
    }

    post({ type: "try-to-renew" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const renewResponse = await delayed(
        client.renew(lastAuth.content.ticketNonce),
        time.renewDelayTime,
        () => post({ type: "delayed-to-renew" }),
    )
    if (!renewResponse.success) {
        post({ type: "failed-to-renew", err: renewResponse.err })
        return
    }
    if (!renewResponse.hasCredential) {
        const storeResponse = authCredentials.removeAuthCredential()
        if (!storeResponse.success) {
            post({ type: "storage-error", err: storeResponse.err })
            return
        }

        post({ type: "required-to-login" })
        return
    }

    const storeResponse = authCredentials.storeAuthCredential(renewResponse.authCredential)
    if (!storeResponse.success) {
        post({ type: "storage-error", err: storeResponse.err })
        return
    }

    post({ type: "succeed-to-renew" })
}
const setContinuousRenewAction = ({ authCredentials, client, time, runner }: SetContinuousRenewInfra): SetContinuousRenewAction => (post) => {
    const lastAuth = findLastAuth(authCredentials)
    if (!lastAuth.success) {
        post({ type: "storage-error", err: lastAuth.err })
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
            }, time.renewIntervalTime.interval_milli_second)
        }
    }, runner.nextRun(lastAuthAt, time.renewRunDelayTime).delay_milli_second)

    async function continuousRenew(ticketNonce: TicketNonce): Promise<boolean> {
        // 画面へのフィードバックはしないので、イベントは発行しない
        const renewResponse = await client.renew(ticketNonce)
        if (!renewResponse.success) {
            return false
        }
        if (!renewResponse.hasCredential) {
            authCredentials.removeAuthCredential()
            return false
        }

        const storeResponse = authCredentials.storeAuthCredential(renewResponse.authCredential)
        if (!storeResponse.success) {
            return false
        }

        return true
    }
}
function findLastAuth(authCredentials: AuthCredentialRepository): FoundLastAuth {
    const ticketNonce = authCredentials.findTicketNonce()
    if (!ticketNonce.success) {
        return { success: false, err: ticketNonce.err }
    }
    if (!ticketNonce.found) {
        return { success: true, found: false }
    }

    const lastAuthAt = authCredentials.findLastAuthAt()
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

const storeAction = (infra: StoreInfra): StoreAction => async (authCredential, post) => {
    const storeResponse = infra.authCredentials.storeAuthCredential(authCredential)
    if (!storeResponse.success) {
        post({ type: "storage-error", err: storeResponse.err })
        return
    }
}

export function initRenewAction(infra: RenewInfra): RenewAction {
    return renewAction(infra)
}
export function initSetContinousRenewAction(infra: SetContinuousRenewInfra): SetContinuousRenewAction {
    return setContinuousRenewAction(infra)
}
export function initStoreAction(infra: StoreInfra): StoreAction {
    return storeAction(infra)
}

interface Post<T> {
    (state: T): void
}
