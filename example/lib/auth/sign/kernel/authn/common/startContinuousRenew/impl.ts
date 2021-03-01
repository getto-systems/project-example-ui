import { StartContinuousRenewInfra } from "./infra"

import { ForceStartContinuousRenewMethod, StartContinuousRenewMethod } from "./method"

import { authzRepositoryConverter } from "../../../../../../common/authz/convert"
import { lastAuthRepositoryConverter, renewRemoteConverter } from "../../kernel/convert"

import { hasExpired, toLastAuth } from "../../kernel/data"

interface Start {
    (infra: StartContinuousRenewInfra): StartContinuousRenewMethod
}
export const startContinuousRenew: Start = (infra) => (info, post) => {
    const lastAuth = infra.lastAuth(lastAuthRepositoryConverter)

    const result = lastAuth.set(toLastAuth(info))
    if (!result.success) {
        post({ type: "repository-error", err: result.err })
        return
    }

    start(infra)

    post({ type: "succeed-to-start-continuous-renew" })
}

export interface ForceStart {
    (infra: StartContinuousRenewInfra): ForceStartContinuousRenewMethod
}
export const forceStartContinuousRenew: ForceStart = (infra) => (post) => {
    start(infra)

    post({ type: "succeed-to-start-continuous-renew" })
}

function start(infra: StartContinuousRenewInfra) {
    const { config } = infra

    const timer = setInterval(async () => {
        // 設定された interval ごとに更新
        const result = await continuousRenew()
        if (!result.next) {
            clearInterval(timer)
        }
    }, config.interval.interval_millisecond)

    async function continuousRenew(): Promise<{ next: boolean }> {
        // 継続更新は本体が置き換わってから実行されるので、イベント通知しない
        const { clock, config } = infra
        const authz = infra.authz(authzRepositoryConverter)
        const lastAuth = infra.lastAuth(lastAuthRepositoryConverter)
        const renew = infra.renew(renewRemoteConverter(clock))

        const CANCEL = { next: false }
        const NEXT = { next: true }

        const result = lastAuth.get()
        if (!result.success) {
            return CANCEL
        }
        if (!result.found) {
            lastAuth.remove()
            authz.remove()
            return CANCEL
        }

        // 前回の更新時刻が新しければ今回は通信しない
        const time = {
            now: clock.now(),
            expire_millisecond: config.delay.delay_millisecond,
        }
        if (!hasExpired(result.value.lastAuthAt, time)) {
            return NEXT
        }

        const response = await renew(result.value.nonce)
        if (!response.success) {
            if (response.err.type === "invalid-ticket") {
                lastAuth.remove()
                authz.remove()
            }
            return CANCEL
        }

        if (!lastAuth.set(toLastAuth(response.value.authn)).success) {
            return CANCEL
        }
        if (!authz.set(response.value.authz).success) {
            return CANCEL
        }

        return NEXT
    }
}
