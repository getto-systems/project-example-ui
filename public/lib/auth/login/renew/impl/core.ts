import { RenewInfra, SetContinuousRenewInfra, StoreInfra } from "../infra"

import { Find, Remove, Renew, SetContinuousRenew, Store } from "../action"

export const renew = (infra: RenewInfra): Renew => () => async (lastLogin, post) => {
    const { client, expires, time, delayed } = infra

    if (!expires.hasExceeded(lastLogin.lastLoginAt, time.instantLoadExpire)) {
        post({ type: "try-to-instant-load" })
        return
    }

    post({ type: "try-to-renew" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(client.renew(lastLogin.ticketNonce), time.delay, () =>
        post({ type: "delayed-to-renew" })
    )
    if (!response.success) {
        post({ type: "failed-to-renew", err: response.err })
        return
    }
    if (!response.hasCredential) {
        post({ type: "unauthorized" })
        return
    }

    post({ type: "succeed-to-renew", authCredential: response.authCredential })
}
export const setContinuousRenew = (infra: SetContinuousRenewInfra): SetContinuousRenew => () => (
    lastLogin,
    post
) => {
    const { client, time, runner } = infra

    setTimeout(async () => {
        if (await continuousRenew()) {
            const timer = setInterval(async () => {
                if (!(await continuousRenew())) {
                    clearInterval(timer)
                }
            }, time.interval.interval_millisecond)
        }
    }, runner.nextRun(lastLogin.lastLoginAt, time.delay).delay_millisecond)

    async function continuousRenew(): Promise<boolean> {
        const response = await client.renew(lastLogin.ticketNonce)
        if (!response.success) {
            post({ type: "failed-to-renew", err: response.err })
            return false
        }
        if (!response.hasCredential) {
            post({ type: "unauthorized" })
            return false
        }

        post({ type: "succeed-to-renew", authCredential: response.authCredential })
        return true
    }
}

export const find = (infra: StoreInfra): Find => () => (post) => {
    const { authCredentials } = infra
    const ticketNonce = authCredentials.findTicketNonce()
    if (!ticketNonce.success) {
        post({ type: "failed-to-find", err: ticketNonce.err })
        return
    }
    if (!ticketNonce.found) {
        post({ type: "not-found" })
        return
    }

    const lastLoginAt = authCredentials.findLastLoginAt()
    if (!lastLoginAt.success) {
        post({ type: "failed-to-find", err: lastLoginAt.err })
        return
    }
    if (!lastLoginAt.found) {
        post({ type: "not-found" })
        return
    }

    post({
        type: "succeed-to-find",
        lastLogin: {
            ticketNonce: ticketNonce.content,
            lastLoginAt: lastLoginAt.content,
        },
    })
}

export const store = (infra: StoreInfra): Store => () => async (authCredential, post) => {
    const { authCredentials } = infra
    const storeResponse = authCredentials.storeAuthCredential(authCredential)
    if (!storeResponse.success) {
        post({ type: "failed-to-store", err: storeResponse.err })
        return
    }
    post({ type: "succeed-to-store" })
}

export const remove = (infra: StoreInfra): Remove => () => async (post) => {
    const { authCredentials } = infra
    const storeResponse = authCredentials.removeAuthCredential()
    if (!storeResponse.success) {
        post({ type: "failed-to-remove", err: storeResponse.err })
        return
    }
    post({ type: "succeed-to-remove" })
}
