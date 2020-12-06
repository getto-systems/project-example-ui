import { RenewInfra, SetContinuousRenewInfra,  } from "../infra"

import { RenewPod, SetContinuousRenewPod,  } from "../action"

export const renew = (infra: RenewInfra): RenewPod => () => async (lastLogin, post) => {
    const { client, expires, time, delayed } = infra

    if (!expires.hasExceeded(lastLogin.lastLoginAt, time.instantLoadExpire)) {
        post({ type: "try-to-instant-load" })
        return
    }

    post({ type: "try-to-renew" })

    // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
    const response = await delayed(client.renew(lastLogin.ticketNonce), time.delay, () =>
        post({ type: "delayed-to-renew" })
    )
    if (!response.success) {
        post({ type: "failed-to-renew", err: response.err })
        return
    }
    if (!response.hasCredential) {
        post({ type: "unauthorized" })
        return
    }

    post({ type: "succeed-to-renew", authCredential: response.authCredential })
}
export const setContinuousRenew = (infra: SetContinuousRenewInfra): SetContinuousRenewPod => () => (
    lastLogin,
    post
) => {
    const { client, time, runner } = infra

    setTimeout(async () => {
        if (await continuousRenew()) {
            const timer = setInterval(async () => {
                if (!(await continuousRenew())) {
                    clearInterval(timer)
                }
            }, time.interval.interval_millisecond)
        }
    }, runner.nextRun(lastLogin.lastLoginAt, time.delay).delay_millisecond)

    async function continuousRenew(): Promise<boolean> {
        const response = await client.renew(lastLogin.ticketNonce)
        if (!response.success) {
            post({ type: "failed-to-renew", err: response.err })
            return false
        }
        if (!response.hasCredential) {
            post({ type: "unauthorized" })
            return false
        }

        post({ type: "succeed-to-renew", authCredential: response.authCredential })
        return true
    }
}
