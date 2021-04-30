import { authzRepositoryConverter } from "../../kernel/converter"
import { authnRepositoryConverter, authRemoteConverter } from "../../kernel/converter"

import { StartContinuousRenewInfra } from "../infra"

import { SaveAuthTicketMethod, StartContinuousRenewMethod } from "../method"

import { hasExpired } from "../../kernel/data"
import { StartContinuousRenewEvent } from "../event"

interface Save {
    (infra: StartContinuousRenewInfra): SaveAuthTicketMethod
}
export const saveAuthTicket: Save = (infra) => async (info, post) => {
    const authn = infra.authn(authnRepositoryConverter)
    const authz = infra.authz(authzRepositoryConverter)

    const authnResult = await authn.set(info.authn)
    if (!authnResult.success) {
        return post({ type: "failed-to-save", err: authnResult.err })
    }
    const authzResult = await authz.set(info.authz)
    if (!authzResult.success) {
        return post({ type: "failed-to-save", err: authzResult.err })
    }

    return post({ type: "succeed-to-save" })
}

interface Start {
    (infra: StartContinuousRenewInfra): StartContinuousRenewMethod
}
export const startContinuousRenew: Start = (infra) => (post) => {
    return new Promise((resolve) => {
        const { config } = infra

        const timer = setInterval(async () => {
            // 設定された interval ごとに更新
            const result = await continuousRenew()
            const state = post(result)
            if (!result.continue) {
                clearInterval(timer)
                resolve(state)
            }
        }, config.interval.interval_millisecond)

        post({ type: "succeed-to-start-continuous-renew", continue: true })
    })

    async function continuousRenew(): Promise<StartContinuousRenewEvent> {
        const { clock, config } = infra
        const authz = infra.authz(authzRepositoryConverter)
        const authn = infra.authn(authnRepositoryConverter)
        const renew = infra.renew(authRemoteConverter(clock))

        const result = await authn.get()
        if (!result.success) {
            return { type: "repository-error", continue: false, err: result.err }
        }
        if (!result.found) {
            return clearTicket()
        }

        // 前回の更新時刻が新しければ今回は通信しない
        const time = { now: clock.now(), ...config.authnExpire }
        if (!hasExpired(result.value.authAt, time)) {
            return { type: "authn-not-expired", continue: true }
        }

        const response = await renew({ type: "always" })
        if (!response.success) {
            if (response.err.type === "unauthorized") {
                return clearTicket()
            } else {
                return { type: "failed-to-renew", continue: false, err: response.err }
            }
        }

        const authnStoreResult = await authn.set(response.value.authn)
        if (!authnStoreResult.success) {
            return { type: "repository-error", continue: false, err: authnStoreResult.err }
        }

        const authzStoreResult = await authn.set(response.value.authn)
        if (!authzStoreResult.success) {
            return { type: "repository-error", continue: false, err: authzStoreResult.err }
        }

        return { type: "succeed-to-renew", continue: true }

        async function clearTicket(): Promise<StartContinuousRenewEvent> {
            const authnRemoveResult = await authn.remove()
            if (!authnRemoveResult.success) {
                return { type: "repository-error", continue: false, err: authnRemoveResult.err }
            }

            const authzRemoveResult = await authz.remove()
            if (!authzRemoveResult.success) {
                return { type: "repository-error", continue: false, err: authzRemoveResult.err }
            }

            return { type: "required-to-login", continue: false }
        }
    }
}

export function startContinuousRenewEventHasDone(event: StartContinuousRenewEvent): boolean {
    switch (event.type) {
        case "succeed-to-start-continuous-renew":
        case "authn-not-expired":
        case "succeed-to-renew":
            return false

        case "required-to-login":
        case "failed-to-renew":
        case "repository-error":
            return true
    }
}
