import { RenewActionInfra, Request, ForceRequest, RequestInfra } from "./infra"

import { RenewAction, RenewActionPod } from "./action"

import { ForceRequestEvent } from "./event"

import { hasExpired, LastLogin } from "../common/data"

export function initRenewAction(pod: RenewActionPod): RenewAction {
    return {
        request: pod.initRequest(),
        forceRequest: pod.initForceRequest(),
    }
}
export function initRenewActionPod(infra: RenewActionInfra): RenewActionPod {
    return {
        initRequest: request(infra),
        initForceRequest: forceRequest(infra),
    }
}

const request: Request = (infra) => () => async (post) => {
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

const forceRequest: ForceRequest = (infra) => () => async (post) => {
    loadLastLogin(infra, post, (lastLogin) => {
        renew(infra, lastLogin, post)
    })
}

function loadLastLogin(
    infra: RequestInfra,
    post: Post<ForceRequestEvent>,
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
async function renew(infra: RequestInfra, lastLogin: LastLogin, post: Post<ForceRequestEvent>) {
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

interface Post<T> {
    (event: T): void
}
