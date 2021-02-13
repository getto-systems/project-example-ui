import { ContinuousRenewActionInfra, ForceStart, Start, StartInfra } from "./infra"

import { ContinuousRenewAction, ContinuousRenewActionPod } from "./action"

import { hasExpired } from "../common/data"

export function initContinuousRenewAction(pod: ContinuousRenewActionPod): ContinuousRenewAction {
    return {
        start: pod.initStart(),
        forceStart: pod.initForceStart(),
    }
}
export function initContinuousRenewActionPod(
    infra: ContinuousRenewActionInfra
): ContinuousRenewActionPod {
    return {
        initStart: start(infra),
        initForceStart: forceStart(infra),
    }
}

const start: Start = (infra) => () => (authCredential, post) => {
    const { authCredentials } = infra

    const storeResult = authCredentials.store(authCredential)
    if (!storeResult.success) {
        post({ type: "storage-error", err: storeResult.err })
        return
    }

    setContinuousRenew(infra)

    post({ type: "succeed-to-start-continuous-renew" })
}

const forceStart: ForceStart = (infra) => () => (post) => {
    setContinuousRenew(infra)

    post({ type: "succeed-to-start-continuous-renew" })
}

function setContinuousRenew(infra: StartInfra) {
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
        const { authCredentials, renew, clock, config } = infra

        const CANCEL = { next: false }
        const NEXT = { next: true }

        const loadResult = authCredentials.load()
        if (!loadResult.success || !loadResult.found) {
            return CANCEL
        }

        // 保存された credential の更新時刻が新しければ今回は通信しない
        const time = {
            now: clock.now(),
            expire_millisecond: config.delay.delay_millisecond,
        }
        if (!hasExpired(loadResult.lastLogin.lastAuthAt, time)) {
            return NEXT
        }

        const response = await renew(loadResult.lastLogin.ticketNonce)
        if (!response.success) {
            if (response.err.type === "invalid-ticket") {
                authCredentials.remove()
            }
            return CANCEL
        }

        const storeResult = authCredentials.store(response.value)
        if (!storeResult.success) {
            return CANCEL
        }

        return NEXT
    }
}
