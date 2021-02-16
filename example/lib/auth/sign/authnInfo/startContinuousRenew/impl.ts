import {
    StartContinuousRenewAuthnInfoActionInfra,
    ForceStartContinuousRenewAuthnInfo,
    StartContinuousRenewAuthnInfo,
    StartContinuousRenewAuthnInfoInfra,
} from "./infra"

import { StartContinuousRenewAuthnInfoAction } from "./action"

import { hasExpired } from "../common/data"

export function initStartContinuousRenewAuthnInfoAction(
    infra: StartContinuousRenewAuthnInfoActionInfra
): StartContinuousRenewAuthnInfoAction {
    return {
        start: startContinuousRenewAuthnInfo(infra),
        forceStart: forceStartContinuousRenewAuthnInfo(infra),
    }
}

export const startContinuousRenewAuthnInfo: StartContinuousRenewAuthnInfo = (infra) => (
    authnInfo,
    post
) => {
    const { authnInfos } = infra

    const storeResult = authnInfos.store(authnInfo)
    if (!storeResult.success) {
        post({ type: "storage-error", err: storeResult.err })
        return
    }

    start(infra)

    post({ type: "succeed-to-start-continuous-renew" })
}

export const forceStartContinuousRenewAuthnInfo: ForceStartContinuousRenewAuthnInfo = (
    infra
) => (post) => {
    start(infra)

    post({ type: "succeed-to-start-continuous-renew" })
}

function start(infra: StartContinuousRenewAuthnInfoInfra) {
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
        const { apiCredentials, authnInfos, renew, clock, config } = infra

        const CANCEL = { next: false }
        const NEXT = { next: true }

        const loadResult = authnInfos.load()
        if (!loadResult.success || !loadResult.found) {
            return CANCEL
        }

        // 保存された credential の更新時刻が新しければ今回は通信しない
        const time = {
            now: clock.now(),
            expire_millisecond: config.delay.delay_millisecond,
        }
        if (!hasExpired(loadResult.lastAuth.lastAuthAt, time)) {
            return NEXT
        }

        const response = await renew(loadResult.lastAuth.authnNonce)
        if (!response.success) {
            if (response.err.type === "invalid-ticket") {
                authnInfos.remove()
            }
            return CANCEL
        }

        if (!authnInfos.store(response.value.auth).success) {
            return CANCEL
        }
        if (!apiCredentials.store(response.value.api).success) {
            return CANCEL
        }

        return NEXT
    }
}
