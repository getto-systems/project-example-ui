import { LogoutInfra, RenewInfra, SetContinuousRenewInfra } from "../infra"

import { ForceRenewPod, LogoutPod, RenewPod, SetContinuousRenewPod } from "../action"

import { ForceRenewEvent } from "../event"

import { hasExpired, LastLogin } from "../../../common/credential/data"

export const renew = (infra: RenewInfra): RenewPod => () => async (post) => {
    const { clock, config } = infra

    findLastLogin(infra, post, (lastLogin) => {
        if (
            !hasExpired(lastLogin.lastAuthAt, {
                now: clock.now(),
                expire_millisecond: config.instantLoadExpire.expire_millisecond,
            })
        ) {
            post({ type: "try-to-instant-load" })
            return
        }

        renewCredential(infra, lastLogin, post)
    })
}
export const forceRenew = (infra: RenewInfra): ForceRenewPod => () => async (post) => {
    findLastLogin(infra, post, (lastLogin) => {
        renewCredential(infra, lastLogin, post)
    })
}
function findLastLogin(
    infra: RenewInfra,
    post: Post<ForceRenewEvent>,
    hook: { (lastLogin: LastLogin): void }
) {
    const { authCredentials } = infra

    const findResult = authCredentials.findLastLogin()
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
            const removeResult = authCredentials.removeAuthCredential()
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

    const storeResult = authCredentials.storeAuthCredential(response.value)
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
        const storeResult = authCredentials.storeAuthCredential(authCredential.authCredential)
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

        const findResult = authCredentials.findLastLogin()
        if (!findResult.success || !findResult.found) {
            return CANCEL
        }

        // 保存された credential の更新時刻が新しければ今回は通信しない
        if (
            !hasExpired(findResult.lastLogin.lastAuthAt, {
                now: clock.now(),
                expire_millisecond: config.delay.delay_millisecond,
            })
        ) {
            return NEXT
        }

        const response = await renew(findResult.lastLogin.ticketNonce)
        if (!response.success) {
            if (response.err.type === "invalid-ticket") {
                authCredentials.removeAuthCredential()
            }
            return CANCEL
        }

        const storeResult = authCredentials.storeAuthCredential(response.value)
        if (!storeResult.success) {
            return CANCEL
        }

        return NEXT
    }
}

export const logout = ({ authCredentials }: LogoutInfra): LogoutPod => () => async (post) => {
    const result = authCredentials.removeAuthCredential()
    if (!result.success) {
        post({ type: "failed-to-logout", err: result.err })
        return
    }
    post({ type: "succeed-to-logout" })
}

interface Post<T> {
    (event: T): void
}