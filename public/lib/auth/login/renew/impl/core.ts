import { RenewInfra, SetContinuousRenewInfra } from "../infra"

import { RenewPod, SetContinuousRenewPod } from "../action"
import { StorageError } from "../../../common/credential/data"

export const renew = (infra: RenewInfra): RenewPod => () => async (post) => {
    const { authCredentials, client, expires, config, delayed } = infra

    const findResult = authCredentials.findLastLogin()
    if (!findResult.success) {
        post(storageError(findResult))
        return
    }
    if (!findResult.found) {
        post({ type: "required-to-login" })
        return
    }

    if (!expires.hasExceeded(findResult.lastLogin.lastLoginAt, config.instantLoadExpire)) {
        post({ type: "try-to-instant-load" })
        return
    }

    post({ type: "try-to-renew" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(client.renew(findResult.lastLogin.ticketNonce), config.delay, () =>
        post({ type: "delayed-to-renew" })
    )
    if (!response.success) {
        post({ type: "failed-to-renew", err: response.err })
        return
    }
    if (!response.hasCredential) {
        const removeResult = authCredentials.removeAuthCredential()
        if (!removeResult.success) {
            post(storageError(removeResult))
            return
        }
        post({ type: "required-to-login" })
        return
    }

    const storeResult = authCredentials.storeAuthCredential(response.authCredential)
    if (!storeResult.success) {
        post(storageError(storeResult))
        return
    }

    post({ type: "succeed-to-renew", authCredential: response.authCredential })
}
export const setContinuousRenew = (infra: SetContinuousRenewInfra): SetContinuousRenewPod => () => (
    authCredential,
    post
) => {
    const { authCredentials, client, config, runner } = infra

    if (authCredential.store) {
        const storeResult = authCredentials.storeAuthCredential(authCredential.authCredential)
        if (!storeResult.success) {
            post(storageError(storeResult))
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
        const findResult = authCredentials.findLastLogin()
        if (!findResult.success || !findResult.found) {
            return cancel()
        }

        // 保存された credential の更新時刻が新しければ今回は通信しない
        if (!runner.nextRun(findResult.lastLogin.lastLoginAt, config.delay)) {
            return next()
        }

        const response = await client.renew(findResult.lastLogin.ticketNonce)
        if (!response.success) {
            return cancel()
        }
        if (!response.hasCredential) {
            authCredentials.removeAuthCredential()
            return cancel()
        }

        const storeResult = authCredentials.storeAuthCredential(response.authCredential)
        if (!storeResult.success) {
            return cancel()
        }

        return next()

        function cancel() {
            return { next: false }
        }
        function next() {
            return { next: true }
        }
    }
}

type StorageErrorEvent = { type: "storage-error"; err: StorageError }
function storageError(result: { err: StorageError }): StorageErrorEvent {
    return { type: "storage-error", err: result.err }
}
