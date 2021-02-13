import { LogoutInfra, RenewInfra, SetContinuousRenewInfra } from "./infra"

import { ForceRenewPod, LogoutPod, RenewPod, SetContinuousRenewPod } from "./action"

import { ForceRenewEvent } from "./event"
import { hasExpired, LastLogin } from "./data"

export const renew = (infra: RenewInfra): RenewPod => () => async (post) => {
    const { clock, config } = infra

    loadLastLogin(infra, post, (lastLogin) => {
        const time = {
            now: clock.now(),
            expire_millisecond: config.instantLoadExpire.expire_millisecond,
        }

        if (hasExpired(lastLogin.lastAuthAt, time)) {
            renewCredential(infra, lastLogin, post)
            return
        }

        post({ type: "try-to-instant-load" })
    })
}
export const forceRenew = (infra: RenewInfra): ForceRenewPod => () => async (post) => {
    loadLastLogin(infra, post, (lastLogin) => {
        renewCredential(infra, lastLogin, post)
    })
}
function loadLastLogin(
    infra: RenewInfra,
    post: Post<ForceRenewEvent>,
    hook: { (lastLogin: LastLogin): void }
) {
    const { authCredentials } = infra

    const findResult = authCredentials.load()
    if (!findResult.success) {
        post({ type: "storage-error", err: findResult.err })
        return
    }
    if (!findResult.found) {
        post({ type: "required-to-login" })
        return
    }

    hook(findResult.lastLogin)
}
async function renewCredential(infra: RenewInfra, lastLogin: LastLogin, post: Post<ForceRenewEvent>) {
    const { authCredentials, renew, config, delayed } = infra

    post({ type: "try-to-renew" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(renew(lastLogin.ticketNonce), config.delay, () =>
        post({ type: "delayed-to-renew" })
    )
    if (!response.success) {
        if (response.err.type === "invalid-ticket") {
            const removeResult = authCredentials.remove()
            if (!removeResult.success) {
                post({ type: "storage-error", err: removeResult.err })
                return
            }
            post({ type: "required-to-login" })
            return
        }
        post({ type: "failed-to-renew", err: response.err })
        return
    }

    const storeResult = authCredentials.store(response.value)
    if (!storeResult.success) {
        post({ type: "storage-error", err: storeResult.err })
        return
    }

    post({ type: "succeed-to-renew", authCredential: response.value })
}

export const setContinuousRenew = (infra: SetContinuousRenewInfra): SetContinuousRenewPod => () => (
    authCredential,
    post
) => {
    const { authCredentials, renew, clock, config } = infra

    if (authCredential.store) {
        const storeResult = authCredentials.store(authCredential.authCredential)
        if (!storeResult.success) {
            post({ type: "storage-error", err: storeResult.err })
            return
        }
    }

    const timer = setInterval(async () => {
        // 設定された interval ごとに更新
        const result = await continuousRenew()
        if (!result.next) {
            clearInterval(timer)
        }
    }, config.interval.interval_millisecond)

    post({ type: "succeed-to-set-continuous-renew" })

    // 継続更新は本体が置き換わってから実行されるので、イベント通知しない
    async function continuousRenew(): Promise<{ next: boolean }> {
        const CANCEL = { next: false }
        const NEXT = { next: true }

        const loadResult = authCredentials.load()
        if (!loadResult.success || !loadResult.found) {
            return CANCEL
        }

        // 保存された credential の更新時刻が新しければ今回は通信しない
        if (
            !hasExpired(loadResult.lastLogin.lastAuthAt, {
                now: clock.now(),
                expire_millisecond: config.delay.delay_millisecond,
            })
        ) {
            return NEXT
        }

        const response = await renew(loadResult.lastLogin.ticketNonce)
        if (!response.success) {
            if (response.err.type === "invalid-ticket") {
                authCredentials.remove()
            }
            return CANCEL
        }

        const storeResult = authCredentials.store(response.value)
        if (!storeResult.success) {
            return CANCEL
        }

        return NEXT
    }
}

export const logout = ({ authCredentials }: LogoutInfra): LogoutPod => () => async (post) => {
    const result = authCredentials.remove()
    if (!result.success) {
        post({ type: "failed-to-logout", err: result.err })
        return
    }
    post({ type: "succeed-to-logout" })
}

interface Post<T> {
    (event: T): void
}
