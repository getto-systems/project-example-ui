import { StoreResult } from "../../../../../z_getto/storage/infra"
import { RenewInfra } from "./infra"

import { ForceRenewMethod, RenewMethod } from "./method"

import { ForceRenewEvent } from "./event"

import { hasExpired, LastAuth } from "../kernel/data"

interface Renew {
    (infra: RenewInfra): RenewMethod
}
export const renew: Renew = (infra) => async (post) => {
    const { clock, config } = infra

    loadLastAuth(infra, post, (lastAuth) => {
        const time = {
            now: clock.now(),
            expire_millisecond: config.instantLoadExpire.expire_millisecond,
        }
        if (hasExpired(lastAuth.lastAuthAt, time)) {
            requestRenew(infra, lastAuth, post)
            return
        }

        post({ type: "try-to-instant-load" })
    })
}

interface ForceRenew {
    (infra: RenewInfra): ForceRenewMethod
}
export const forceRenew: ForceRenew = (infra) => async (post) => {
    loadLastAuth(infra, post, (lastAuth) => {
        requestRenew(infra, lastAuth, post)
    })
}

function loadLastAuth(
    infra: RenewInfra,
    post: Post<ForceRenewEvent>,
    hook: { (lastAuth: LastAuth): void },
) {
    const { authnInfos } = infra

    const findResult = authnInfos.load()
    if (!findResult.success) {
        post({ type: "storage-error", err: findResult.err })
        return
    }
    if (!findResult.found) {
        post({ type: "required-to-login" })
        return
    }

    hook(findResult.lastAuth)
}
async function requestRenew(infra: RenewInfra, lastAuth: LastAuth, post: Post<ForceRenewEvent>) {
    const { apiCredentials, authnInfos, renew, config, delayed } = infra

    post({ type: "try-to-renew" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(renew(lastAuth.authnNonce), config.delay, () =>
        post({ type: "delayed-to-renew" }),
    )
    if (!response.success) {
        if (response.err.type === "invalid-ticket") {
            const removeResult = authnInfos.remove()
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

    if (!checkStorageError(authnInfos.store(response.value.auth))) {
        return
    }
    if (!checkStorageError(apiCredentials.store(response.value.api))) {
        return
    }

    post({ type: "succeed-to-renew", authnInfo: response.value.auth })

    function checkStorageError(result: StoreResult): boolean {
        if (!result.success) {
            post({ type: "storage-error", err: result.err })
        }
        return result.success
    }
}

interface Post<T> {
    (event: T): void
}
