import { authzRepositoryConverter } from "../../../../../../../common/authz/convert"
import { lastAuthRepositoryConverter, authRemoteConverter } from "../../../kernel/convert"

import { RepositoryStoreResult } from "../../../../../../../z_vendor/getto-application/infra/repository/infra"
import { StartContinuousRenewInfra } from "../infra"

import { SaveAuthInfoMethod, StartContinuousRenewMethod } from "../method"

import { hasExpired, toLastAuth } from "../../../kernel/data"
import { StartContinuousRenewEvent } from "../event"

interface Save {
    (infra: StartContinuousRenewInfra): SaveAuthInfoMethod
}
export const saveAuthInfo: Save = (infra) => (info) => {
    const lastAuth = infra.lastAuth(lastAuthRepositoryConverter)
    const authz = infra.authz(authzRepositoryConverter)

    const lastAuthResult = lastAuth.set(toLastAuth(info.authn))
    if (!lastAuthResult.success) {
        return lastAuthResult
    }
    const authzResult = authz.set(info.authz)
    if (!authzResult.success) {
        return authzResult
    }

    return { success: true }
}

interface Start {
    (infra: StartContinuousRenewInfra): StartContinuousRenewMethod
}
export const startContinuousRenew: Start = (infra) => (post) => {
    const { config } = infra

    const timer = setInterval(async () => {
        // 設定された interval ごとに更新
        const result = await continuousRenew()
        if (!result.next) {
            clearInterval(timer)
        }
    }, config.interval.interval_millisecond)

    post({ type: "succeed-to-start-continuous-renew" })

    async function continuousRenew(): Promise<{ next: boolean }> {
        const { clock, config } = infra
        const authz = infra.authz(authzRepositoryConverter)
        const lastAuth = infra.lastAuth(lastAuthRepositoryConverter)
        const renew = infra.renew(authRemoteConverter(clock))

        const CANCEL = { next: false }
        const NEXT = { next: true }

        const result = lastAuth.get()
        if (!result.success) {
            post({ type: "repository-error", err: result.err })
            return CANCEL
        }
        if (!result.found) {
            handleStoreResult(lastAuth.remove())
            handleStoreResult(authz.remove())
            return CANCEL
        }

        // 前回の更新時刻が新しければ今回は通信しない
        const time = { now: clock.now(), ...config.lastAuthExpire }
        if (!hasExpired(result.value.lastAuthAt, time)) {
            post({ type: "lastAuth-not-expired" })
            return NEXT
        }

        const response = await renew(result.value.nonce)
        if (!response.success) {
            if (response.err.type === "invalid-ticket") {
                handleStoreResult(lastAuth.remove())
                handleStoreResult(authz.remove())
                post({ type: "required-to-login" })
            } else {
                post({ type: "failed-to-continuous-renew", err: response.err })
            }
            return CANCEL
        }

        if (!handleStoreResult(lastAuth.set(toLastAuth(response.value.authn)))) {
            return CANCEL
        }
        if (!handleStoreResult(authz.set(response.value.authz))) {
            return CANCEL
        }

        post({ type: "succeed-to-continuous-renew" })
        return NEXT
    }

    function handleStoreResult(result: RepositoryStoreResult): boolean {
        if (!result.success) {
            post({ type: "repository-error", err: result.err })
        }
        return result.success
    }
}

export function startContinuousRenewEventHasDone(event: StartContinuousRenewEvent): boolean {
    switch (event.type) {
        case "succeed-to-start-continuous-renew":
        case "lastAuth-not-expired":
        case "succeed-to-continuous-renew":
            return false

        case "required-to-login":
        case "failed-to-continuous-renew":
        case "repository-error":
            return true
    }
}
