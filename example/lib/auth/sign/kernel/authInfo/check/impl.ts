import { delayedChecker } from "../../../../../z_vendor/getto-application/infra/timer/helper"

import { RepositoryStoreResult } from "../../../../../z_vendor/getto-application/infra/repository/infra"
import { CheckAuthInfoInfra } from "./infra"

import { RenewAuthInfoMethod, CheckAuthInfoMethod } from "./method"

import { RenewAuthInfoEvent } from "./event"

import { hasExpired, LastAuth, toLastAuth } from "../kernel/data"
import { lastAuthRepositoryConverter, renewRemoteConverter } from "../kernel/convert"
import { authzRepositoryConverter } from "../../../../../common/authz/convert"

interface CheckAuthInfo {
    (infra: CheckAuthInfoInfra): CheckAuthInfoMethod
}
export const checkAuthInfo: CheckAuthInfo = (infra) => async (post) => {
    const { clock, config } = infra

    loadLastAuth(infra, post, (lastAuth) => {
        const time = {
            now: clock.now(),
            expire_millisecond: config.instantLoadExpire.expire_millisecond,
        }
        if (hasExpired(lastAuth.lastAuthAt, time)) {
            renew(infra, lastAuth, post)
            return
        }

        post({ type: "try-to-instant-load" })
    })
}

interface RenewAuthInfo {
    (infra: CheckAuthInfoInfra): RenewAuthInfoMethod
}
export const renewAuthInfo: RenewAuthInfo = (infra) => async (post) => {
    loadLastAuth(infra, post, (lastAuth) => {
        renew(infra, lastAuth, post)
    })
}

function loadLastAuth(
    infra: CheckAuthInfoInfra,
    post: Post<RenewAuthInfoEvent>,
    hook: { (lastAuth: LastAuth): void },
) {
    const lastAuth = infra.lastAuth(lastAuthRepositoryConverter)

    const findResult = lastAuth.get()
    if (!findResult.success) {
        post({ type: "repository-error", err: findResult.err })
        return
    }
    if (!findResult.found) {
        post({ type: "required-to-login" })
        return
    }

    hook(findResult.value)
}
async function renew(infra: CheckAuthInfoInfra, info: LastAuth, post: Post<RenewAuthInfoEvent>) {
    const { clock, config } = infra
    const lastAuth = infra.lastAuth(lastAuthRepositoryConverter)
    const authz = infra.authz(authzRepositoryConverter)
    const renew = infra.renew(renewRemoteConverter(clock))

    post({ type: "try-to-renew" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayedChecker(renew(info.nonce), config.delay, () =>
        post({ type: "delayed-to-renew" }),
    )
    if (!response.success) {
        if (response.err.type === "invalid-ticket") {
            const removeResult = lastAuth.remove()
            if (!removeResult.success) {
                post({ type: "repository-error", err: removeResult.err })
                return
            }
            post({ type: "required-to-login" })
            return
        }
        post({ type: "failed-to-renew", err: response.err })
        return
    }

    if (!checkStorageError(lastAuth.set(toLastAuth(response.value.authn)))) {
        return
    }
    if (!checkStorageError(authz.set(response.value.authz))) {
        return
    }

    post({ type: "succeed-to-renew", auth: response.value })

    function checkStorageError(result: RepositoryStoreResult): boolean {
        if (!result.success) {
            post({ type: "repository-error", err: result.err })
        }
        return result.success
    }
}

interface Post<T> {
    (event: T): void
}
