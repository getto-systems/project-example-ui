import { delayedChecker } from "../../../../../../z_vendor/getto-application/infra/timer/helper"

import { StoreRepositoryResult } from "../../../../../../z_vendor/getto-application/infra/repository/infra"
import { CheckAuthInfoInfra } from "../infra"

import { RenewAuthInfoMethod, CheckAuthInfoMethod } from "../method"

import { CheckAuthInfoEvent, RenewAuthInfoEvent } from "../event"

import { Authn, hasExpired } from "../../kernel/data"
import { authnRepositoryConverter, authRemoteConverter } from "../../kernel/converter"
import { authzRepositoryConverter } from "../../kernel/converter"

interface CheckAuthInfo {
    (infra: CheckAuthInfoInfra): CheckAuthInfoMethod
}
export const checkAuthInfo: CheckAuthInfo = (infra) => async (post) => {
    const { clock, config } = infra

    loadAuthn(infra, post, (authn) => {
        const time = {
            now: clock.now(),
            expire_millisecond: config.instantLoadExpire.expire_millisecond,
        }
        if (hasExpired(authn.authAt, time)) {
            renew(infra, authn, post)
            return
        }

        post({ type: "try-to-instant-load" })
    })
}

export function checkAuthInfoEventHasDone(event: CheckAuthInfoEvent): boolean {
    switch (event.type) {
        case "try-to-instant-load":
            return true

        default:
            return renewAuthInfoEventHasDone(event)
    }
}

interface RenewAuthInfo {
    (infra: CheckAuthInfoInfra): RenewAuthInfoMethod
}
export const renewAuthInfo: RenewAuthInfo = (infra) => async (post) => {
    loadAuthn(infra, post, (authn) => {
        renew(infra, authn, post)
    })
}

function loadAuthn(
    infra: CheckAuthInfoInfra,
    post: Post<RenewAuthInfoEvent>,
    hook: { (authn: Authn): void },
) {
    const authn = infra.authn(authnRepositoryConverter)

    const findResult = authn.get()
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
async function renew(infra: CheckAuthInfoInfra, info: Authn, post: Post<RenewAuthInfoEvent>) {
    const { clock, config } = infra
    const authn = infra.authn(authnRepositoryConverter)
    const authz = infra.authz(authzRepositoryConverter)
    const renew = infra.renew(authRemoteConverter(clock))

    post({ type: "try-to-renew" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に take longtime イベントを発行
    const response = await delayedChecker(renew(info.nonce), config.takeLongtimeThreshold, () =>
        post({ type: "take-longtime-to-renew" }),
    )
    if (!response.success) {
        if (response.err.type === "invalid-ticket") {
            const removeResult = authn.remove()
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

    if (!checkRepositoryError(authn.set(response.value.authn))) {
        return
    }
    if (!checkRepositoryError(authz.set(response.value.authz))) {
        return
    }

    post({ type: "succeed-to-renew", auth: response.value })

    function checkRepositoryError(result: StoreRepositoryResult): boolean {
        if (!result.success) {
            post({ type: "repository-error", err: result.err })
        }
        return result.success
    }
}

export function renewAuthInfoEventHasDone(event: RenewAuthInfoEvent): boolean {
    switch (event.type) {
        case "required-to-login":
        case "failed-to-renew":
        case "repository-error":
        case "succeed-to-renew":
            return true

        case "try-to-renew":
        case "take-longtime-to-renew":
            return false
    }
}

interface Post<T> {
    (event: T): void
}
