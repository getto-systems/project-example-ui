import {
    StartContinuousRenewAuthCredentialActionInfra,
    ForceStartContinuousRenewAuthCredential,
    StartContinuousRenewAuthCredential,
    StartContinuousRenewAuthCredentialInfra,
} from "./infra"

import { StartContinuousRenewAuthCredentialAction } from "./action"

import { hasExpired } from "../common/data"

export function initStartContinuousRenewAuthCredentialAction(
    infra: StartContinuousRenewAuthCredentialActionInfra
): StartContinuousRenewAuthCredentialAction {
    return {
        start: start(infra),
        forceStart: forceStart(infra),
    }
}

const start: StartContinuousRenewAuthCredential = (infra) => (authCredential, post) => {
    const { authCredentials } = infra

    const storeResult = authCredentials.store(authCredential)
    if (!storeResult.success) {
        post({ type: "storage-error", err: storeResult.err })
        return
    }

    setContinuousRenew(infra)

    post({ type: "succeed-to-start-continuous-renew" })
}

const forceStart: ForceStartContinuousRenewAuthCredential = (infra) => (post) => {
    setContinuousRenew(infra)

    post({ type: "succeed-to-start-continuous-renew" })
}

function setContinuousRenew(infra: StartContinuousRenewAuthCredentialInfra) {
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
        const { apiCredentials, authCredentials, renew, clock, config } = infra

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

        if (!authCredentials.store(response.value.auth).success) {
            return CANCEL
        }
        if (!apiCredentials.store(response.value.api).success) {
            return CANCEL
        }

        return NEXT
    }
}
