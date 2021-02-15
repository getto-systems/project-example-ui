import { StoreResult } from "../../../../common/storage/infra"
import { RenewAuthCredentialActionInfra, RequestRenewAuthCredential, ForceRequestRenewAuthCredential, RequestRenewAuthCredentialInfra } from "./infra"

import { RenewAuthCredentialAction } from "./action"

import { ForceRequestRenewAuthCredentialEvent } from "./event"

import { hasExpired, LastAuth } from "../common/data"

export function initRenewAuthCredentialAction(infra: RenewAuthCredentialActionInfra): RenewAuthCredentialAction {
    return {
        request: request(infra)(),
        forceRequest: forceRequest(infra)(),
    }
}

const request: RequestRenewAuthCredential = (infra) => () => async (post) => {
    const { clock, config } = infra

    loadLastLogin(infra, post, (lastLogin) => {
        const time = {
            now: clock.now(),
            expire_millisecond: config.instantLoadExpire.expire_millisecond,
        }
        if (hasExpired(lastLogin.lastAuthAt, time)) {
            renew(infra, lastLogin, post)
            return
        }

        post({ type: "try-to-instant-load" })
    })
}

const forceRequest: ForceRequestRenewAuthCredential = (infra) => () => async (post) => {
    loadLastLogin(infra, post, (lastLogin) => {
        renew(infra, lastLogin, post)
    })
}

function loadLastLogin(
    infra: RequestRenewAuthCredentialInfra,
    post: Post<ForceRequestRenewAuthCredentialEvent>,
    hook: { (lastLogin: LastAuth): void }
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
async function renew(
    infra: RequestRenewAuthCredentialInfra,
    lastLogin: LastAuth,
    post: Post<ForceRequestRenewAuthCredentialEvent>
) {
    const { apiCredentials, authCredentials, renew, config, delayed } = infra

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

    if (!checkStorageError(authCredentials.store(response.value.auth))) {
        return
    }
    if (!checkStorageError(apiCredentials.store(response.value.api))) {
        return
    }

    post({ type: "succeed-to-renew", authCredential: response.value.auth })

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
